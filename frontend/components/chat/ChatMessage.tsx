"use client";
import { Message } from "@/lib/api";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        paddingLeft: isUser ? 80 : 0,
        paddingRight: isUser ? 0 : 80,
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          fontSize: 14,
          lineHeight: 1.5,
          color: isUser ? "#fff" : "var(--text-primary)",
          background: isUser ? "var(--accent)" : "var(--bg-surface)",
          borderRadius: 16,
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
        }}
      >
        {message.content}
      </div>
    </div>
  );
}
