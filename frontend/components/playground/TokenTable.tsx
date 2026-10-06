"use client";

interface TokenTableProps {
  tokens: number[];
  log_probs: number[];
  tokenDetails: Array<{ id: number; str: string }>;
}

export default function TokenTable({ tokens, log_probs, tokenDetails }: TokenTableProps) {
  const maxProb = Math.max(...log_probs.map((lp) => Math.exp(lp)));
  const minProb = Math.min(...log_probs.map((lp) => Math.exp(lp)));

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <table className="w-full text-xs font-mono">
        <thead>
          <tr style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
            <th className="px-3 py-2 text-left font-medium">#</th>
            <th className="px-3 py-2 text-left font-medium">Token</th>
            <th className="px-3 py-2 text-right font-medium">Log Prob</th>
            <th className="px-3 py-2 text-right font-medium">Confidence</th>
            <th className="px-3 py-2 font-medium">Bar</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, i) => {
            const prob = Math.exp(log_probs[i] ?? 0);
            const barWidth = maxProb > minProb
              ? ((prob - minProb) / (maxProb - minProb)) * 100
              : 50;
            return (
              <tr
                key={i}
                className="transition-colors"
                style={{
                  borderTop: "1px solid var(--border)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-3 py-2" style={{ color: "var(--text-secondary)" }}>
                  {i + 1}
                </td>
                <td className="px-3 py-2">
                  <code
                    className="rounded px-1.5 py-0.5"
                    style={{ background: "var(--bg-elevated)", color: "var(--accent)" }}
                  >
                    {tokenDetails[i]?.str ?? JSON.stringify(token)}
                  </code>
                </td>
                <td className="px-3 py-2 text-right" style={{ color: "var(--text-secondary)" }}>
                  {(log_probs[i] ?? 0).toFixed(4)}
                </td>
                <td className="px-3 py-2 text-right" style={{ color: "var(--text-secondary)" }}>
                  {(prob * 100).toFixed(1)}%
                </td>
                <td className="px-3 py-2 w-32">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${barWidth}%`,
                      background: "var(--accent)",
                      minWidth: 2,
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
