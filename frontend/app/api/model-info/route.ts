import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "GPT-2",
    parameters: "124M",
    layers: 12,
    heads: 12,
    vocab_size: 50257,
    context_length: 1024,
    description:
      "MiniMind uses GPT-2 as the core language model for text generation. It processes input tokens through 12 transformer layers with 12 attention heads each.",
    concepts: [
      { id: 1, name: "Self-Attention", description: "Allows each token to attend to all other tokens in the sequence" },
      { id: 2, name: "Feed-Forward", description: "MLP layers that transform attention outputs" },
      { id: 3, name: "Positional Encoding", description: "Injects sequence position information" },
      { id: 4, name: "Layer Norm", description: "Normalizes activations for stable training" },
    ],
  });
}
