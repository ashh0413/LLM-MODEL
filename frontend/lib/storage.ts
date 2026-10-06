// Client-side only storage (localStorage)
// This module should only be imported in client components or hooks

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: string;
  content: string;
  tokens?: number;
  attention_weights?: string;
  created_at?: string;
}

const STORAGE_KEYS = {
  conversations: "minimind_conversations",
  messages: "minimind_messages",
} as const;

function getNextId(items: Array<{ id: number }>): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id)) + 1;
}

// Conversations
export function getConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.conversations);
  return raw ? JSON.parse(raw) : [];
}

export function createConversation(title: string): Conversation {
  const conversations = getConversations();
  const now = new Date().toISOString();
  const newConv: Conversation = {
    id: getNextId(conversations),
    title,
    created_at: now,
    updated_at: now,
  };
  localStorage.setItem(
    STORAGE_KEYS.conversations,
    JSON.stringify([newConv, ...conversations])
  );
  return newConv;
}

export function deleteConversation(id: number): void {
  localStorage.setItem(
    STORAGE_KEYS.conversations,
    JSON.stringify(getConversations().filter((c) => c.id !== id))
  );
  // Cascade-delete messages for this conversation
  localStorage.setItem(
    STORAGE_KEYS.messages,
    JSON.stringify(getAllMessages().filter((m) => m.conversation_id !== id))
  );
}

// Messages
function getAllMessages(): Message[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.messages);
  return raw ? JSON.parse(raw) : [];
}

export function getMessages(convId: number): Message[] {
  return getAllMessages().filter((m) => m.conversation_id === convId);
}

export function saveMessage(msg: Omit<Message, "id">): Message {
  const messages = getAllMessages();
  const newMsg: Message = {
    ...msg,
    id: getNextId(messages),
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify([...messages, newMsg]));

  // Update conversation timestamp
  const conversations = getConversations();
  const idx = conversations.findIndex((c) => c.id === msg.conversation_id);
  if (idx !== -1) {
    conversations[idx].updated_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(conversations));
  }

  return newMsg;
}
