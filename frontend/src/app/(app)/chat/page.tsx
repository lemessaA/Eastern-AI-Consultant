"use client";

import { useSearchParams } from "next/navigation";

import { ChatWindow } from "@/components/chat/chat-window";
import type { AgentType } from "@/types";

export default function ChatPage() {
  const params = useSearchParams();
  const agent = (params.get("agent") as AgentType | null) ?? "teacher";
  const conversationId = params.get("conversation");
  // Re-mount ChatWindow when the conversation id changes so that internal
  // state (messages, conversation_id) is fully reset.
  return (
    <ChatWindow
      key={conversationId ?? "new"}
      initialAgent={agent}
      initialConversationId={conversationId}
    />
  );
}
