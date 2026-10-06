"use client";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        rows={1}
        placeholder="Send a message..."
        disabled={disabled}
        className="flex-1 rounded-xl px-4 py-3 text-sm resize-none"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          minHeight: 48,
          maxHeight: 160,
        }}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex-shrink-0 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
        style={{
          background: disabled || !value.trim() ? "var(--bg-elevated)" : "var(--accent)",
          color: disabled || !value.trim() ? "var(--text-secondary)" : "#fff",
          cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
        }}
      >
        {disabled ? "..." : "Send"}
      </button>
    </form>
  );
}
