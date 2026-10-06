"use client";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import AttentionVisualizer from "@/components/chat/AttentionVisualizer";
import TokenTable from "@/components/playground/TokenTable";

export default function PlaygroundPage() {
  const { gen, loading, error } = useApi();
  const [prompt, setPrompt] = useState("");
  const [maxTokens, setMaxTokens] = useState(50);
  const [temperature, setTemperature] = useState(0.9);
  const [topP, setTopP] = useState(0.9);
  const [result, setResult] = useState<unknown>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const r = await gen(prompt, maxTokens, temperature, topP);
    setResult(r);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Playground</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                placeholder="Enter your prompt..."
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                Max Tokens: {maxTokens}
              </label>
              <input
                type="range"
                min={10}
                max={200}
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                Temperature: {temperature.toFixed(2)}
              </label>
              <input
                type="range"
                min={0}
                max={2}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                <span>Precise</span><span>Creative</span>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                Top-P: {topP.toFixed(2)}
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={topP}
                onChange={(e) => setTopP(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-3 rounded-xl font-semibold transition-all"
              style={{
                background: loading ? "var(--bg-elevated)" : "var(--accent)",
                color: "#fff",
                opacity: loading || !prompt.trim() ? 0.5 : 1,
              }}
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            {error && (
              <div className="p-3 rounded-xl" style={{ background: "rgba(255,100,100,0.1)", color: "#ff6b6b" }}>
                {error}
              </div>
            )}
          </div>

          {/* Output */}
          <div className="flex flex-col gap-4">
            {result ? (
              <>
                <div>
                  <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Output</h2>
                  <div
                    className="rounded-xl p-4 text-sm whitespace-pre-wrap"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                  >
                    {(result as { text: string }).text}
                  </div>
                </div>
                <TokenTable
                  tokenDetails={(result as { token_details?: Array<{ id: number; str: string }> }).token_details || []}
                  logProbs={(result as { log_probs?: number[] }).log_probs || []}
                />
                <AttentionVisualizer
                  tokens={(result as { token_details?: Array<{ id: number; str: string }> }).token_details || []}
                  attentionWeights={(result as { attention_weights?: Array<{ layer: number; weights: number[][][] }> }).attention_weights || []}
                />
              </>
            ) : (
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", minHeight: 200 }}
              >
                <span style={{ color: "var(--text-secondary)" }}>Generated output will appear here</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
