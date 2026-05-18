"use client";

import { memo } from "react";

import { Bot, User } from "lucide-react";

import { ChatMarkdown } from "@/components/chat/markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { AGENTS, type AgentDef } from "@/components/chat/agent-picker";

export interface MessageAttachment {
  filename: string;
}

export interface MessageData {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  agent?: string | null;
  pending?: boolean;
  attachments?: MessageAttachment[];
}

function ChatMessageImpl({
  message,
  userName,
}: {
  message: MessageData;
  userName?: string;
}) {
  const isUser = message.role === "user";
  const agent: AgentDef | undefined = AGENTS.find((a) => a.key === message.agent);
  const AgentIcon = agent?.icon ?? Bot;

  return (
    <div
      className={cn(
        "flex gap-3 sm:gap-4 max-w-3xl mx-auto py-4",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar className="h-8 w-8 shrink-0 mt-1">
        {isUser ? (
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-primary">
            <AgentIcon className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className={cn("flex-1 min-w-0", isUser && "text-right")}>
        <div className="text-xs text-muted-foreground mb-1">
          {isUser ? userName ?? "You" : agent?.name ?? "Assistant"}
        </div>
        <div
          className={cn(
            "inline-block rounded-2xl px-4 py-3 text-sm",
            "max-w-full break-words text-left",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm",
          )}
        >
          {message.role === "assistant" ? (
            <ChatMarkdown content={message.content} />
          ) : (
            <>
              {message.attachments && message.attachments.length > 0 && (
                <ul className="mb-2 space-y-1 text-xs opacity-90">
                  {message.attachments.map((a) => (
                    <li key={a.filename} className="truncate">
                      📎 {a.filename}
                    </li>
                  ))}
                </ul>
              )}
              {message.content ? (
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              ) : null}
            </>
          )}
          {message.pending && (
            <span className="ml-1 inline-block h-3 w-2 align-middle bg-current animate-blink" />
          )}
        </div>
      </div>
    </div>
  );
}

export const ChatMessage = memo(ChatMessageImpl);