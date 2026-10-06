const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const res = await fetch(`${BASE}/api/chat/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`Generation failed: ${res.statusText}`);
  return res.json();
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: "user" | "assistant" | "system";
  content: string;
  tokens: number | null;
  created_at: string;
}

export async function listConversations(): Promise<Conversation[]> {
  const res = await fetch(`${BASE}/api/conversations/`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function createConversation(title: string): Promise<Conversation> {
  const res = await fetch(`${BASE}/api/conversations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function deleteConversation(id: number): Promise<void> {
  await fetch(`${BASE}/api/conversations/${id}`, { method: "DELETE" });
}

export async function getMessages(convId: number): Promise<Message[]> {
  const res = await fetch(`${BASE}/api/conversations/${convId}/messages`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function saveMessage(msg: {
  conversation_id: number;
  role: string;
  content: string;
  tokens?: number;
  attention_weights?: string;
}): Promise<Message> {
  const res = await fetch(`${BASE}/api/conversations/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg),
  });
  if (!res.ok) throw new Error(res.statusText);
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
  const res = await fetch(`${BASE}/api/model-info/info`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
