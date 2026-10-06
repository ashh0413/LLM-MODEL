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
  claude: "Claude (Fast)",
  huggingface: "GPT-2 (Local)",
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

  const handleSend = async (content: string) => {
    let convId = activeId;
    if (!convId) {
      convId = createConversation("New Chat");
      setConversations(getConversations());
      setActiveId(convId);
    }

    saveMessage({ conversation_id: convId, role: "user", content });
    const currentMessages = getMessages(convId);
    setMessages(currentMessages);

    const prompt = currentMessages
      .map((m: Message) => `${m.role}: ${m.content}`)
      .join("\n");

    setLoading(true);

    try {
      const apiPath = model === "claude" ? "/api/claude" : "/api/huggingface";
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, maxTokens: 300, temperature: 0.9 }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const result = await res.json();

      saveMessage({ conversation_id: convId, role: "assistant", content: result.text });
      setMessages(getMessages(convId));
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    const id = createConversation("New Chat");
    setConversations(getConversations());
    setActiveId(id);
    setMessages([]);
  };

  const handleSelectChat = (id: number) => {
    setActiveId(id);
    setMessages(getMessages(id));
  };

  const handleDeleteChat = (id: number) => {
    deleteConversation(id);
    setConversations(getConversations());
    if (activeId === id) {
      const remaining = getConversations();
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
        setMessages(getMessages(remaining[0].id));
      } else {
        setActiveId(null);
        setMessages([]);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onNew={handleNewChat}
        onSelect={handleSelectChat}
        onDelete={handleDeleteChat}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h1 style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 600 }}>
            MiniMind Chat
          </h1>
          <div className="flex gap-2">
            {(Object.keys(MODEL_LABELS) as Model[]).map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  border: model === m ? "2px solid var(--accent)" : "1px solid var(--border)",
                  background: model === m ? "var(--accent)" : "var(--bg-surface)",
                  color: model === m ? "#fff" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {MODEL_LABELS[m]}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div style={{ fontSize: "3rem" }}>🧠</div>
              <h2 style={{ color: "var(--text-primary)", fontSize: "1.3rem", fontWeight: 600 }}>
                Welcome to MiniMind
              </h2>
              <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: 400 }}>
                A compact large language model for educational purposes. Send a message to get started!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} disabled={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
