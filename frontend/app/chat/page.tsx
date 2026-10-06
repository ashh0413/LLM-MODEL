"use client";
import { useState, useEffect, useRef } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import {
  getConversations,
  createConversation,
  deleteConversation,
  getMessages,
  saveMessage,
  Conversation,
  Message,
} from "@/lib/storage";

type Model = "claude" | "huggingface";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<Model>("claude");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = getConversations();
    setConversations(existing);
    if (existing.length > 0) {
      setActiveId(existing[0].id);
      setMessages(getMessages(existing[0].id));
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = () => {
    const conv = createConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setMessages([]);
  };

  const handleSelectChat = (id: number) => {
    setActiveId(id);
    setMessages(getMessages(id));
  };

  const handleDeleteChat = (id: number) => {
    deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
        setMessages(getMessages(remaining[0].id));
      } else {
        setActiveId(null);
        setMessages([]);
      }
    }
  };

  const handleSend = async (text: string) => {
    if (!activeId) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    saveMessage(activeId, userMsg);
    setLoading(true);

    try {
      const endpoint = model === "claude" ? "/api/claude" : "/api/huggingface";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const reply: Message = {
        role: "assistant",
        content: data.response || data.error?.message || "Something went wrong.",
      };
      setMessages((prev) => [...prev, reply]);
      saveMessage(activeId, reply);
    } catch {
      const err: Message = { role: "assistant", content: "Failed to get response." };
      setMessages((prev) => [...prev, err]);
      saveMessage(activeId, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-primary)" }}>
      <ChatSidebar
        activeId={activeId}
        onNew={handleNewChat}
        onSelect={handleSelectChat}
        onDelete={handleDeleteChat}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)" }}>
            {conversations.find((c) => c.id === activeId)?.title || "New Chat"}
          </div>

          {/* Model Toggle */}
          <div style={{ display: "flex", gap: 0, background: "var(--bg-surface)", borderRadius: 8, padding: 2, border: "1px solid var(--border)" }}>
            {(["claude", "huggingface"] as Model[]).map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                style={{
                  padding: "5px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  background: model === m ? "var(--bg-primary)" : "transparent",
                  color: model === m ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {m === "claude" ? "Claude" : "GPT-2"}
              </button>
            ))}
          </div>
        </header>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          {messages.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Start a conversation
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 0, paddingRight: 80 }}>
                  <div
                    style={{
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "var(--text-secondary)",
                      background: "var(--bg-surface)",
                      borderRadius: 16,
                      borderBottomLeftRadius: 4,
                    }}
                  >
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "0 24px 20px", flexShrink: 0 }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <ChatInput onSend={handleSend} disabled={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
