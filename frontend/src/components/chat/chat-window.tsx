"use client";

import * as React from "react";
import { Mic, Paperclip, Send, Sparkles, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";

import { AGENTS, AgentPicker } from "@/components/chat/agent-picker";
import { ChatMessage, type MessageData } from "@/components/chat/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { useAuthStore } from "@/store/auth";
import type { AgentType } from "@/types";
import { API_BASE } from "@/lib/api";

export function ChatWindow({ initialAgent = "teacher" as AgentType }: { initialAgent?: AgentType }) {
  const { t, locale } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);

  const [agent, setAgent] = React.useState<AgentType>(initialAgent);
  const [messages, setMessages] = React.useState<MessageData[]>([]);
  const [input, setInput] = React.useState("");
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [streaming, setStreaming] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Voice input via Web Speech API ---
  const [listening, setListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  function toggleListening() {
    if (typeof window === "undefined") return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = locale === "am" ? "am-ET" : locale === "so" ? "so-SO" : "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        transcript += e.results[i][0].transcript;
      }
      setInput((prev) => `${prev}${transcript}`.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  }

  function readAloud(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Text-to-speech not supported.");
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale === "am" ? "am-ET" : locale === "so" ? "so-SO" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  // --- Streaming submit ---
  async function send(forced?: string) {
    const message = (forced ?? input).trim();
    if (!message || streaming) return;

    const userMsg: MessageData = { role: "user", content: message };
    const assistantMsg: MessageData = {
      role: "assistant",
      content: "",
      agent,
      pending: true,
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_BASE}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message,
          agent_type: agent,
          language: locale,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`Stream failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const chunk of events) {
          const lines = chunk.split("\n");
          let dataLine = "";
          let currentEvent = "message";
          for (const ln of lines) {
            if (ln.startsWith("event: ")) currentEvent = ln.slice(7).trim();
            if (ln.startsWith("data: ")) dataLine += ln.slice(6);
          }
          if (!dataLine) continue;
          let data: any;
          try {
            data = JSON.parse(dataLine);
          } catch {
            continue;
          }

          if (currentEvent === "meta") {
            if (data.conversation_id) setConversationId(data.conversation_id);
            if (data.agent_type) setAgent(data.agent_type);
          } else if (currentEvent === "token") {
            accumulated += data.text || "";
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last.role === "assistant") {
                next[next.length - 1] = { ...last, content: accumulated, pending: true };
              }
              return next;
            });
          } else if (currentEvent === "done") {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last.role === "assistant") {
                next[next.length - 1] = { ...last, content: accumulated, pending: false, id: data.message_id };
              }
              return next;
            });
          } else if (currentEvent === "error") {
            toast.error(data.message ?? "Streaming error");
          }
        }
      }
    } catch (err: unknown) {
      if ((err as { name?: string })?.name !== "AbortError") {
        toast.error("Could not reach the AI service.");
      }
      setMessages((prev) => prev.filter((m) => !(m.role === "assistant" && m.pending)));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  function newChat() {
    setMessages([]);
    setConversationId(null);
  }

  const suggestions = [
    t("chat.promptExamples.0"),
    t("chat.promptExamples.1"),
    t("chat.promptExamples.2"),
    t("chat.promptExamples.3"),
  ];

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      {/* Sidebar: agents */}
      <div className="hidden lg:flex flex-col gap-3 rounded-xl border border-border bg-card p-3 overflow-y-auto scrollbar-thin">
        <Button onClick={newChat} variant="outline" size="sm" className="w-full justify-start gap-2">
          <Sparkles className="h-4 w-4" /> {t("chat.newChat")}
        </Button>
        <AgentPicker value={agent} onChange={setAgent} />
      </div>

      {/* Chat panel */}
      <div className="flex min-h-0 flex-col rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {(() => {
                const A = AGENTS.find((x) => x.key === agent);
                const Icon = A?.icon ?? Sparkles;
                return <Icon className="h-4 w-4" />;
              })()}
            </div>
            <div>
              <p className="text-sm font-medium">
                {AGENTS.find((x) => x.key === agent)?.name ?? "AI Assistant"}
              </p>
              <p className="text-xs text-muted-foreground">
                {AGENTS.find((x) => x.key === agent)?.description}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={newChat}>
            {t("chat.newChat")}
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/30">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold">
                Hello {user?.full_name?.split(" ")[0] ?? "there"} 👋
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                Ask me anything — in English, Amharic, Afaan Oromo or Af-Soomaali. I'll pick the right specialist for you automatically.
              </p>
              <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-border bg-background p-4 text-left text-sm hover:border-primary/40 hover:bg-primary/5 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-2">
              {messages.map((m, i) => (
                <div key={i} className="group">
                  <ChatMessage message={m} userName={user?.full_name} />
                  {m.role === "assistant" && !m.pending && (
                    <div className="max-w-3xl mx-auto flex items-center justify-start gap-1 pl-12 -mt-2 mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-muted-foreground"
                        onClick={() => readAloud(m.content)}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        {t("chat.readAloud")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-border p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-2"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("chat.attachFile")}
              disabled
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={listening ? "gradient" : "ghost"}
              size="icon"
              aria-label={t("chat.voiceInput")}
              onClick={toggleListening}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={t("chat.placeholder")}
              rows={1}
              className="min-h-[44px] max-h-32 flex-1 resize-none"
            />
            {streaming ? (
              <Button type="button" variant="destructive" size="icon" onClick={stop} aria-label="Stop">
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="gradient"
                size="icon"
                aria-label={t("chat.send")}
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
