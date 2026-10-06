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
      <div className="flex-1 relative">
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
          placeholder="Ask anything..."
          disabled={disabled}
          className="w-full rounded-2xl px-4 py-3.5 text-base resize-none transition-all"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            minHeight: 48,
            maxHeight: 120,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          background: disabled || !value.trim() ? "var(--bg-surface)" : "var(--accent)",
          color: disabled || !value.trim() ? "var(--text-secondary)" : "#fff",
          cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
          border: "none",
          boxShadow: disabled || !value.trim() ? "none" : "var(--shadow-sm)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </form>
  );
}
