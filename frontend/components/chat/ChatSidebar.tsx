"use client";
import { useState, useEffect } from "react";
import {
  getConversations,
  createConversation,
  deleteConversation,
  getMessages,
  Conversation,
} from "@/lib/storage";

interface ChatSidebarProps {
  activeId: number | null;
  onNew: () => void;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ChatSidebar({ activeId, onNew, onSelect, onDelete }: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    setConversations(getConversations());
  }, []);

  const handleNew = () => {
    onNew();
    setConversations(getConversations());
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onDelete(id);
    setConversations(getConversations());
  };

  return (
    <aside
      style={{
        width: 260,
        height: "100vh",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={handleNew}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all 0.15s ease",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New chat
        </button>
      </div>

      {/* Conversation List */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
        {conversations.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 12,
              marginTop: 24,
            }}
          >
            No conversations yet
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                marginBottom: 2,
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                background: activeId === conv.id ? "var(--hover-bg)" : "transparent",
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) => {
                if (activeId !== conv.id) e.currentTarget.style.background = "var(--hover-bg)";
              }}
              onMouseLeave={(e) => {
                if (activeId !== conv.id) e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: activeId === conv.id ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: activeId === conv.id ? 500 : 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 170,
                }}
              >
                {conv.title || "New conversation"}
              </span>
              <button
                onClick={(e) => handleDelete(e, conv.id)}
                style={{
                  opacity: activeId === conv.id ? 1 : 0,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "4px",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 0.12s, color 0.12s",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
