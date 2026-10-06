"use client";
import { Message } from "@/lib/api";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  return (
    <div
      className="flex gap-3 animate-fadeIn"
      style={{
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {!isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          M
        </div>
      )}
      <div
        className="max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={{
          background: isUser ? "var(--accent)" : "var(--bg-surface)",
          color: isUser ? "#fff" : "var(--text-primary)",
          border: isUser ? "none" : "1px solid var(--border)",
        }}
      >
        {message.content}
      </div>
      {isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
        >
          U
        </div>
      )}
    </div>
  );
}
