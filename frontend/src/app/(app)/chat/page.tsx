"use client";

import { useSearchParams } from "next/navigation";

import { ChatWindow } from "@/components/chat/chat-window";
import type { AgentType } from "@/types";

export default function ChatPage() {
  const params = useSearchParams();
  const agent = (params.get("agent") as AgentType | null) ?? "teacher";
  return <ChatWindow initialAgent={agent} />;
}
