import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

export interface RuntimeModelConfig {
  provider: "kafu" | "openai" | "local";
  apiKey?: string;
  baseURL?: string;
  chatModel: string;
  embeddingModel?: string;
  visionModel?: string;
  rerankModel?: string;
}

function maskSecret(secret?: string) {
  if (!secret) {
    return "未配置";
  }

  if (secret.length <= 10) {
    return "已配置";
  }

  return `${secret.slice(0, 6)}...${secret.slice(-4)}`;
}

export function getRuntimeModelConfig(): RuntimeModelConfig {
  if (process.env.KAFU_LLM_API_KEY) {
    return {
      provider: "kafu",
      apiKey: process.env.KAFU_LLM_API_KEY,
      baseURL: process.env.KAFU_LLM_BASE_URL,
      chatModel: process.env.KAFU_CHAT_MODEL || "qwen3-max",
      embeddingModel: process.env.KAFU_EMBEDDING_MODEL,
      visionModel: process.env.KAFU_VISION_MODEL,
      rerankModel: process.env.KAFU_RERANK_MODEL,
    };
  }

  if (process.env.OPENAI_API_KEY || process.env.GPT_API_KEY) {
    return {
      provider: "openai",
      apiKey: process.env.OPENAI_API_KEY || process.env.GPT_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || process.env.GPT_BASE_URL,
      chatModel: process.env.OPENAI_MODEL || process.env.GPT_CHAT_MODEL || "gpt-4o-mini",
    };
  }

  return {
    provider: "local",
    chatModel: "local-fallback",
  };
}

export function createConfiguredOpenAI() {
  const config = getRuntimeModelConfig();

  if (!config.apiKey) {
    return null;
  }

  return createOpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });
}

export function getSettingsConfigSummary() {
  const config = getRuntimeModelConfig();

  return {
    provider: config.provider,
    chatModel: config.chatModel,
    baseURL: config.baseURL ? config.baseURL.replace(/\/[^/]*$/, "/...") : "默认",
    apiKey: maskSecret(config.apiKey),
    embeddingModel: config.embeddingModel ?? "未配置",
    visionModel: config.visionModel ?? "未配置",
    rerankModel: config.rerankModel ?? "未配置",
    settingsPassword: process.env.SETTINGS_PASSWORD ? "已配置" : "未配置",
  };
}

export function verifySettingsPassword(password: string) {
  const expected = process.env.SETTINGS_PASSWORD;
  if (!expected) {
    return false;
  }

  return password === expected;
}
