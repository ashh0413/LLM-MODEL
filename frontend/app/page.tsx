"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        background: "var(--bg-primary)",
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "var(--accent)",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#fff", fontSize: 20, fontWeight: 600 }}>M</span>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          marginBottom: 12,
          lineHeight: 1.1,
        }}
      >
        MiniMind
      </h1>

      <p
        style={{
          fontSize: 16,
          color: "var(--text-secondary)",
          marginBottom: 48,
          maxWidth: 400,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        A minimal interface for exploring language models
      </p>

      {/* CTA */}
      <button
        onClick={() => router.push("/chat")}
        style={{
          padding: "14px 32px",
          fontSize: 15,
          fontWeight: 500,
          color: "#fff",
          background: "var(--accent)",
          border: "none",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          transition: "opacity 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Start chatting
      </button>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          display: "flex",
          gap: 32,
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        <Link href="/chat" style={{ color: "inherit", textDecoration: "none" }}>
          Chat
        </Link>
        <Link href="/model-info" style={{ color: "inherit", textDecoration: "none" }}>
          Model
        </Link>
        <Link href="/settings" style={{ color: "inherit", textDecoration: "none" }}>
          Settings
        </Link>
      </div>
    </div>
  );
}
