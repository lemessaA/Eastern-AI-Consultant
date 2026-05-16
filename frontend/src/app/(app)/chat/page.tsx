"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ChatWindow } from "@/components/chat/chat-window";
import type { AgentType } from "@/types";

function ChatPageInner() {
  const params = useSearchParams();
  const agent = (params.get("agent") as AgentType | null) ?? "teacher";
  const conversationId = params.get("conversation");
  return (
    <ChatWindow
      key={conversationId ?? "new"}
      initialAgent={agent}
      initialConversationId={conversationId}
    />
  );
}

function ChatPageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center rounded-xl border border-border bg-card">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading chat" />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageFallback />}>
      <ChatPageInner />
    </Suspense>
  );
}
