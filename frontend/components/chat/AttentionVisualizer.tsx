"use client";
import { useState, useEffect, useRef } from "react";

interface TokenDetail {
  id: number;
  str: string;
}

interface AttentionVisualizerProps {
  attentionWeights: Array<{ layer: number; weights: number[][][] }>;
  tokens?: TokenDetail[];
  tokenIds?: number[];
  tokenStrings?: string[];
}

export default function AttentionVisualizer({
  attentionWeights,
  tokens = [],
  tokenIds = [],
  tokenStrings = [],
}: AttentionVisualizerProps) {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const layerCount = attentionWeights.length;

  useEffect(() => {
    if (!canvasRef.current || layerCount === 0) return;
    const layer = attentionWeights[selectedLayer];
    if (!layer) return;

    const weights = layer.weights; // [batch, heads, seq_len, seq_len]
    if (!weights || weights.length === 0 || weights[0].length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const headIdx = 0; // show first head
    const attn = weights[0][headIdx];
    if (!attn) return;

    const size = Math.min(canvas.width, canvas.height, 512);
    const cellSize = size / attn.length;

    // Dark background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw heatmap
    for (let i = 0; i < attn.length; i++) {
      for (let j = 0; j < attn[i].length; j++) {
        const v = Math.max(0, Math.min(1, attn[i][j]));
        const [r, g, b] = heatColor(v);
        ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= attn.length; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }
  }, [attentionWeights, selectedLayer, tokenIds]);

  function heatColor(v: number): [number, number, number] {
    // Blue (low) → Purple → Red (high)
    if (v < 0.33) {
      const t = v / 0.33;
      return [Math.round(20 + t * 60), Math.round(20 + t * 20), Math.round(180 + t * 40)];
    } else if (v < 0.66) {
      const t = (v - 0.33) / 0.33;
      return [Math.round(80 + t * 120), Math.round(40 + t * 20), Math.round(220 - t * 120)];
    } else {
      const t = (v - 0.66) / 0.34;
      return [Math.round(200 + t * 55), Math.round(60 - t * 40), Math.round(100 - t * 80)];
    }
  }

  if (layerCount === 0) {
    return (
      <div className="text-center py-8" style={{ color: "var(--text-secondary)" }}>
        No attention data available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Layer:
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(0, layerCount - 1)}
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(Number(e.target.value))}
          className="flex-1"
        />
        <span
          className="font-mono text-sm"
          style={{ color: "var(--accent)", minWidth: 40 }}
        >
          {selectedLayer}
        </span>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          / {layerCount - 1}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {attentionWeights.map((layer, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedLayer(idx)}
            className="px-3 py-1 rounded-full text-xs font-mono transition-all"
            style={{
              background: selectedLayer === idx ? "var(--accent)" : "var(--bg-elevated)",
              color: selectedLayer === idx ? "#fff" : "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            L{idx}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        className="rounded-xl"
        style={{ border: "1px solid var(--border)", maxWidth: "100%" }}
      />

      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
        <span>Low</span>
        <div
          className="flex-1 h-2 rounded-full"
          style={{
            background: "linear-gradient(to right, #1414b4, #5028c8, #ff3838)",
          }}
        />
        <span>High</span>
      </div>
    </div>
  );
}
