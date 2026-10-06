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
import { generate, GenerateResponse } from "@/lib/api";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
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
    createConversation("New Chat");
    setConversations(getConversations());
    const latest = getConversations();
    if (latest.length > 0) {
      setActiveId(latest[latest.length - 1].id);
      setMessages([]);
    }
  };

  const handleSelectChat = (id: number) => {
    setActiveId(id);
    setMessages(getMessages(id));
  };

  const handleDeleteChat = (id: number) => {
    deleteConversation(id);
    const remaining = getConversations();
    setConversations(remaining);
    if (activeId === id) {
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
        setMessages(getMessages(remaining[0].id));
      } else {
        setActiveId(null);
        setMessages([]);
      }
    }
  };

  const handleSend = async (userMessage: string) => {
    if (!activeId) return;
    setLoading(true);

    // Save user message
    const userMsg = saveMessage({ conversation_id: activeId, role: "user", content: userMessage });
    setMessages((prev) => [...prev, userMsg]);

    // Auto-title from first message
    const convs = getConversations();
    const conv = convs.find((c) => c.id === activeId);
    if (conv && conv.title === "New Chat") {
      const title = userMessage.slice(0, 40) + (userMessage.length > 40 ? "..." : "");
      const updated = convs.map((c) =>
        c.id === activeId ? { ...c, title, updated_at: new Date().toISOString() } : c
      );
      localStorage.setItem("minimind_conversations", JSON.stringify(updated));
      setConversations(updated);
    }

    try {
      const history = getMessages(activeId);
      const prompt = history.map((m) => `${m.role}: ${m.content}`).join("\n");
      const result: GenerateResponse = await generate({
        prompt,
        max_new_tokens: 150,
        temperature: 1.0,
        top_p: 0.9,
      });
      const content = result.text || "No response generated.";
      const assistantMsg = saveMessage({
        conversation_id: activeId,
        role: "assistant",
        content,
        tokens: result.tokens?.length,
      });
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errMsg = saveMessage({
        conversation_id: activeId,
        role: "assistant",
        content: "Error generating response. Please try again.",
      });
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen" style={{ background: "var(--background)", color: "var(--text)" }}>
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onNew={handleNewChat}
        onSelect={handleSelectChat}
        onDelete={handleDeleteChat}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {!activeId || messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <h2 className="text-2xl font-bold">
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
