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

const MODEL_LABELS: Record<Model, string> = {
  claude: "Claude",
  huggingface: "GPT-2",
};

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
    const convId = activeId ?? createConversation().id;
    if (!activeId) {
      const conv = createConversation();
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);
    }

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: Date.now(),
      model,
    };
    const botMsg: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      model,
    };

    setMessages((prev) => [...prev, userMsg, { ...botMsg }]);
    setLoading(true);

    try {
      const endpoint = model === "claude" ? "/api/claude" : "/api/huggingface";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          maxTokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const text = data.text || "No response generated.";

      setMessages((prev) =>
        prev.map((m) => (m.id === botMsg.id ? { ...m, content: text } : m))
      );
      saveMessage(convId, { ...userMsg, conversationId: convId });
      saveMessage(convId, { ...botMsg, conversationId: convId, content: text });
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsg.id ? { ...m, content: "Error: Generation failed" } : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectChat}
        onNew={handleNewChat}
        onDelete={handleDeleteChat}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col" style={{ background: "var(--bg-primary)" }}>
        {/* Apple-style top bar */}
        <header
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Chat
          </h1>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--bg-surface)" }}>
            {(["claude", "huggingface"] as Model[]).map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: model === m ? "var(--bg-primary)" : "transparent",
                  color: model === m ? "var(--text-primary)" : "var(--text-secondary)",
                  boxShadow: model === m ? "var(--shadow-sm)" : "none",
                }}
              >
                {MODEL_LABELS[m]}
              </button>
            ))}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--accent-dim)" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
                Chat with {MODEL_LABELS[model]}
              </h2>
              <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: 360 }}>
                A compact large language model for educational purposes. Ask anything to get started.
              </p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className="px-6 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="max-w-2xl mx-auto">
            <ChatInput onSend={handleSend} disabled={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
