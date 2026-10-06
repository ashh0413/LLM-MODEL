// API client for Next.js API routes (Vercel-ready)
// Only contains HuggingFace generation — conversations use localStorage

export interface GenerateRequest {
  prompt: string;
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export interface TokenDetail {
  id: number;
  str: string;
}

export interface GenerateResponse {
  text: string;
  tokens: number[];
  log_probs: number[];
  attention_weights: Array<{ layer: number; weights: number[][][] }>;
  token_details: TokenDetail[];
}

export async function generate(req: GenerateRequest): Promise<GenerateResponse> {
  const res = await fetch("/api/huggingface", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`Generation failed: ${res.statusText}`);
  return res.json();
}

export interface ModelInfo {
  name: string;
  parameters: string;
  layers: number;
  heads: number;
  vocab_size: number;
  context_length: number;
  description: string;
  concepts: Array<{ id: number; name: string; description: string }>;
}

export async function getModelInfo(): Promise<ModelInfo> {
  const res = await fetch("/api/model-info");
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
