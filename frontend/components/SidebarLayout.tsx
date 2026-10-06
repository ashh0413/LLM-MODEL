"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/playground", label: "Playground", icon: "🧪" },
  { href: "/model-info", label: "Model Info", icon: "🧠" },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar nav */}
      <nav
        className="flex flex-col gap-1 p-3"
        style={{
          width: 72,
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div
          className="mb-4 pt-2 pb-4 text-center"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <Link href="/" className="text-sm font-bold" style={{ color: "var(--accent)" }}>
            MiniMind
          </Link>
        </div>

        {NAV.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs transition-all"
            style={{
              background: pathname === href ? "var(--accent-dim)" : "transparent",
              color: pathname === href ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
