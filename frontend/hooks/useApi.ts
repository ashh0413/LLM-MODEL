"use client";
import { useState, useCallback } from "react";
import {
  generate,
  getModelInfo,
  GenerateResponse,
  ModelInfo,
} from "@/lib/api";
import {
  listConversations,
  createConversation,
  deleteConversation,
  getMessages,
  saveMessage,
  Conversation,
  Message,
} from "@/lib/storage";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gen = useCallback(
    async (prompt: string, maxTokens = 100, temperature = 1.0, topP = 0.9) => {
      setLoading(true);
      setError(null);
      try {
        return await generate({ prompt, max_new_tokens: maxTokens, temperature, top_p: topP });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const conversations = useCallback(async () => {
    return listConversations();
  }, []);

  const create = useCallback(async (title: string) => {
    return createConversation(title);
  }, []);

  const remove = useCallback(async (id: number) => {
    await deleteConversation(id);
  }, []);

  const messages = useCallback(async (convId: number) => {
    return getMessages(convId);
  }, []);

  const save = useCallback(
    async (
      convId: number,
      role: string,
      content: string,
      tokens?: number,
      attention?: string
    ) => {
      return saveMessage({ conversation_id: convId, role, content, tokens, attention_weights: attention });
    },
    []
  );

  const modelInfo = useCallback(async () => {
    return getModelInfo();
  }, []);

  return { gen, conversations, create, remove, messages, save, modelInfo, loading, error };
}
