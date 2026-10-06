"use client";
import { useState, useEffect, useRef } from "react";
import { useApi } from "@/hooks/useApi";
import { Message, Conversation } from "@/lib/api";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import AttentionVisualizer from "@/components/chat/AttentionVisualizer";

export default function ChatPage() {
  const { conversations, create, remove, messages, save, gen, modelInfo, loading, error } = useApi();
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [showAttention, setShowAttention] = useState(false);
  const [lastResult, setLastResult] = useState<unknown>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const list = await conversations();
      setConvs(list);
      if (list.length > 0) setActiveId(list[0].id);
    })();
  }, [conversations]);

  useEffect(() => {
    if (!activeId) return;
    (async () => {
      const m = await messages(activeId);
      setMsgs(m);
    })();
  }, [activeId, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const handleNewChat = async () => {
    const c = await create("New Chat");
    setConvs((prev) => [c, ...prev]);
    setActiveId(c.id);
    setMsgs([]);
    setLastResult(null);
  };

  const handleDelete = async (id: number) => {
    await remove(id);
    setConvs((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const handleSend = async (prompt: string) => {
    if (!activeId) return;
    const userMsg: Message = {
      id: Date.now(),
      conversation_id: activeId,
      role: "user",
      content: prompt,
      tokens: null,
      created_at: new Date().toISOString(),
    };
    setMsgs((prev) => [...prev, userMsg]);

    const result = await gen(prompt);
    const assistantMsg: Message = {
      id: Date.now() + 1,
      conversation_id: activeId,
      role: "assistant",
      content: result.text,
      tokens: result.tokens.length,
      created_at: new Date().toISOString(),
    };
    setMsgs((prev) => [...prev, assistantMsg]);
    setLastResult(result);
    await save(activeId, "user", prompt, result.tokens.length, JSON.stringify(result.attention_weights));
    await save(activeId, "assistant", result.text, result.tokens.length, JSON.stringify(result.attention_weights));
  };

  return (
    <div className="flex h-screen" style={{ background: "var(--bg-primary)" }}>
      <ChatSidebar
        conversations={convs}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNewChat}
        onDelete={handleDelete}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {msgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <span style={{ fontSize: "3rem" }}>🤖</span>
              <p style={{ color: "var(--text-secondary)" }}>Start a conversation with MiniMind</p>
            </div>
          ) : (
            <>
              {msgs.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {lastResult && showAttention && (
                <AttentionVisualizer
                  tokens={(lastResult as { token_details?: Array<{ id: number; str: string }> }).token_details || []}
                  attentionWeights={(lastResult as { attention_weights?: Array<{ layer: number; weights: number[][][] }> }).attention_weights || []}
                />
              )}
            </>
          )}
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "var(--bg-surface)" }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
              <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Generating...</span>
            </div>
          )}
          {error && (
            <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,100,100,0.1)", color: "#ff6b6b" }}>
              {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t px-4 py-4" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setShowAttention((v) => !v)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                background: showAttention ? "var(--accent)" : "var(--accent-dim)",
                color: showAttention ? "#fff" : "var(--accent)",
              }}
            >
              👁 Attention
            </button>
          </div>
          <ChatInput onSend={handleSend} disabled={loading || !activeId} />
        </div>
      </div>
    </div>
  );
}
