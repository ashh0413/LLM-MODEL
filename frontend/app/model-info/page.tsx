"use client";
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";

const CONCEPT_DESCRIPTIONS: Record<number, string> = {
  1: "Token IDs → 768-dim vectors via learned embedding matrix. Each of 50,257 vocab tokens gets a unique dense vector.",
  2: "Fixed sinusoidal or learned positional embeddings added to token embeddings. Tells model WHERE each token sits in sequence.",
  3: "Each token queries all previous tokens' keys. Produces context-aware representations. O(n²) but parallelizable.",
  4: "12 heads run self-attention in parallel, each learning different query/key/value projections. Outputs concatenated and projected.",
  5: "Two-layer MLP (3072 → 768 → 768) with GELU activation. Adds non-linearity after each attention block.",
  6: "Normalizes over features (not batch). γx + β learnable. Stabilizes gradients, enables deeper nets.",
  7: "x + Sublayer(x). Skip connection lets gradients flow directly. Critical for 12+ layer training.",
  8: "exp(x_i) / Σ exp(x_j). Converts raw logits into valid probability distribution summing to 1.",
  9: "Auto-regressive: feed generated token back as input. Repeat until EOS or max tokens hit.",
  10: "Divides logits by T > 1 = sharper/distinctive, T < 1 = flatter/more random. Controls entropy of distribution.",
  11: "Sorts tokens by prob, cumulatively sums. Keeps top-p fraction of probability mass. Dynamic cutoff.",
  12: "L(pred, target) = -log P(target|context). Measures how well model predicts next token.",
  13: "Attention weight matrix per head. Shows which input tokens influenced each output token most.",
};

export default function ModelInfoPage() {
  const { modelInfo } = useApi();
  const [info, setInfo] = useState<{
    name: string;
    parameters: string;
    layers: number;
    heads: number;
    vocab_size: number;
    context_length: number;
    description: string;
    concepts: Array<{ id: number; name: string; description: string }>;
  } | null>(null);

  useEffect(() => {
    modelInfo().then(setInfo);
  }, [modelInfo]);

  if (!info) return null;

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Model Info</h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>{info.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            ["Model", info.name],
            ["Parameters", info.parameters],
            ["Layers", String(info.layers)],
            ["Attention Heads", String(info.heads)],
            ["Vocab Size", String(info.vocab_size)],
            ["Context Length", `${info.context_length} tokens`],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-xl p-4"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{k}</div>
              <div className="font-semibold font-mono text-sm">{v}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">Transformer Architecture</h2>
        <div
          className="relative rounded-2xl p-6 mb-10 overflow-hidden"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <div className="space-y-1 text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
            {[
              "Input: [tok₁, tok₂, tok₃, ..., tok_n]",
              "  ��� Embedding Layer",
              "Token Embeddings + Positional Encoding",
              "  ↓",
              "×12 Transformer Blocks {",
              "    Multi-Head Self-Attention",
              "    + Residual Connection",
              "    LayerNorm",
              "    Feed-Forward MLP",
              "    + Residual Connection",
              "    LayerNorm",
              "}",
              "  ↓",
              "Linear (LM Head)",
              "  ↓ Softmax → Next Token",
            ].map((line, i) => (
              <div key={i} style={{ paddingLeft: line.startsWith("  ") ? 0 : 0 }}>
                <pre className="font-mono text-xs">{line}</pre>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">LLM Concepts</h2>
        <div className="space-y-3">
          {info.concepts.map((c) => (
            <div
              key={c.id}
              className="rounded-xl p-4"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="font-bold font-mono text-xs rounded-lg px-2 py-1 flex-shrink-0 mt-0.5"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  {c.id.toString().padStart(2, "0")}
                </span>
                <div>
                  <div className="font-semibold text-sm mb-1">{c.name}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {CONCEPT_DESCRIPTIONS[c.id] || c.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
