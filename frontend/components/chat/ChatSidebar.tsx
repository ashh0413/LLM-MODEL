"use client";
import { Conversation } from "@/lib/storage";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
  onDelete: (id: number) => void;
}

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ChatSidebarProps) {
  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: 280,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      <div className="p-4">
        <button
          onClick={onNew}
          className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 active:scale-98"
          style={{
            background: "var(--accent)",
            color: "#fff",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          + New Chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-0.5">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all group flex items-center gap-2"
              style={{
                background: activeId === conv.id ? "var(--accent-dim)" : "transparent",
                color: activeId === conv.id ? "var(--accent)" : "var(--text-primary)",
              }}
              onClick={() => onSelect(conv.id)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="flex-1 truncate">
                {conv.title}
              </span>
              <span
                className="opacity-0 group-hover:opacity-100 text-xs px-1.5 py-0.5 rounded transition-opacity"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-secondary)"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
              >
                ×
              </span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
