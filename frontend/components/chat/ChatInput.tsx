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
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        placeholder="Message..."
        disabled={disabled}
        rows={1}
        style={{
          flex: 1,
          padding: "12px 14px",
          fontSize: 14,
          fontFamily: "inherit",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          color: "var(--text-primary)",
          resize: "none",
          outline: "none",
          minHeight: 44,
          maxHeight: 120,
          lineHeight: 1.4,
        }}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        style={{
          width: 36,
          height: 36,
          background: value.trim() && !disabled ? "var(--accent)" : "var(--bg-surface)",
          color: value.trim() && !disabled ? "#fff" : "var(--text-muted)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          cursor: value.trim() && !disabled ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s ease",
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </form>
  );
}
