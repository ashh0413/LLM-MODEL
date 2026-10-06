"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 px-6">
      <div className="text-center">
        <h1
          className="font-bold tracking-tight mb-3"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1.05 }}
        >
          <span style={{ color: "var(--accent)" }}>Mini</span>Mind
        </h1>
        <p className="text-lg" style={{ color: "var(--text-secondary)", maxWidth: 520 }}>
          Educational LLM powered by GPT-2 — see how transformers think
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <Link
          href="/chat"
          className="flex flex-col items-center gap-2 px-6 py-8 rounded-2xl transition-all"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <span className="text-2xl">💬</span>
          <span className="font-semibold">Chat</span>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Conversational interface
          </span>
        </Link>

        <Link
          href="/playground"
          className="flex flex-col items-center gap-2 px-6 py-8 rounded-2xl transition-all"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <span className="text-2xl">🧪</span>
          <span className="font-semibold">Playground</span>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Tune parameters live
          </span>
        </Link>

        <Link
          href="/model-info"
          className="flex flex-col items-center gap-2 px-6 py-8 rounded-2xl transition-all"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <span className="text-2xl">🧠</span>
          <span className="font-semibold">Model Info</span>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Architecture deep-dive
          </span>
        </Link>

        <Link
          href="/settings"
          className="flex flex-col items-center gap-2 px-6 py-8 rounded-2xl transition-all"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <span className="text-2xl">⚙️</span>
          <span className="font-semibold">Settings</span>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Generation params
          </span>
        </Link>
      </div>
    </div>
  );
}
