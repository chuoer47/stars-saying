export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  referenceSummary?: string;
}

export type ChatMode = "live-ai" | "local-fallback";

export interface ChatRuntimeStatus {
  mode: ChatMode;
  label: string;
  detail: string;
}

export interface ChatRequest {
  bodyId: string;
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  relatedBodyId: string;
  relatedSummary: string;
  runtime: ChatRuntimeStatus;
}
