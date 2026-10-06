"use client";
import { Conversation } from "@/lib/api";

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
        width: 260,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      <div className="p-4">
        <button
          onClick={onNew}
          className="w-full py-2 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: "var(--accent)",
            color: "#fff",
          }}
        >
          + New Chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="group flex items-center gap-1 mb-1 rounded-xl px-3 py-2 cursor-pointer transition-all"
            style={{
              background: activeId === conv.id ? "var(--accent-dim)" : "transparent",
              color: activeId === conv.id ? "var(--accent)" : "var(--text-secondary)",
            }}
            onClick={() => onSelect(conv.id)}
          >
            <span
              className="flex-1 truncate text-sm"
              style={{ color: "inherit" }}
            >
              {conv.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-xs px-1 rounded transition-opacity"
              style={{ color: "var(--attention-high)" }}
            >
              ✕
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
}
