"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { canUseSpeechPlayback, speakGently, stopSpeech } from "@/lib/speech";
import type { CelestialBody } from "@/types/celestial";
import type { ChatMessage, ChatResponse, ChatRuntimeStatus } from "@/types/chat";

interface ChatExperienceProps {
  body: CelestialBody;
  knowledgeSummary: string;
  initialRuntime: ChatRuntimeStatus;
}

interface ChatErrorResponse {
  error?: string;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionResultEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

const MAX_STORED_MESSAGES = 20;

function createMessage(
  role: ChatMessage["role"],
  content: string,
  referenceSummary?: string,
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    referenceSummary,
  };
}

function getStorageKey(bodyId: string) {
  return `stars-saying-chat:${bodyId}`;
}

function buildRevealFrames(text: string) {
  const frames: string[] = [];
  let current = "";

  for (const character of text) {
    current += character;

    if (/[，。！？；：,.!?]/.test(character) || current.length % 14 === 0) {
      frames.push(current);
    }
  }

  if (!frames.length || frames[frames.length - 1] !== text) {
    frames.push(text);
  }

  return frames;
}

export function ChatExperience({ body, knowledgeSummary, initialRuntime }: ChatExperienceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastSubmittedMessage, setLastSubmittedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamingReply, setIsStreamingReply] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [runtime, setRuntime] = useState(initialRuntime);
  const [supportsVoiceInput, setSupportsVoiceInput] = useState(false);
  const [supportsVoicePlayback, setSupportsVoicePlayback] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const revealTimeoutRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const placeholder = useMemo(
    () => `想和${body.name}聊点什么？比如：${body.suggestedQuestions[0]}`,
    [body.name, body.suggestedQuestions],
  );

  function clearRevealTimer() {
    if (revealTimeoutRef.current !== null) {
      window.clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }

  function stopPlayback() {
    stopSpeech();
    setSpeakingMessageId(null);
  }

  function startVoiceInput() {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition || isListening) {
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();

      if (transcript) {
        setInput((current) => `${current}${current ? " " : ""}${transcript}`.slice(0, 300));
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }

  function playAssistantMessage(message: ChatMessage) {
    if (!message.content || message.role !== "assistant") {
      return;
    }

    if (speakingMessageId === message.id) {
      stopPlayback();
      return;
    }

    stopPlayback();
    setSpeakingMessageId(message.id);
    speakGently(message.content, {
      onEnd: () => setSpeakingMessageId(null),
      onError: () => setSpeakingMessageId(null),
    });
  }

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    setSupportsVoiceInput(Boolean(speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition));
    setSupportsVoicePlayback(canUseSpeechPlayback());
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(getStorageKey(body.id));

      if (!saved) {
        setMessages([]);
        setHasHydrated(true);
        return;
      }

      const parsed = JSON.parse(saved) as ChatMessage[];

      if (Array.isArray(parsed)) {
        setMessages(parsed.slice(-MAX_STORED_MESSAGES));
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    } finally {
      setHasHydrated(true);
      clearRevealTimer();
      setIsStreamingReply(false);
    }
  }, [body.id]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        getStorageKey(body.id),
        JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
      );
    } catch {
      // Ignore local storage failures and keep the child experience usable.
    }
  }, [body.id, hasHydrated, messages]);

  useEffect(() => {
    return () => {
      clearRevealTimer();
      stopListening();
      stopPlayback();
    };
  }, []);

  function revealAssistantReply(
    reply: string,
    referenceSummary: string,
    nextRuntime: ChatRuntimeStatus,
  ): Promise<ChatMessage> {
    clearRevealTimer();
    setRuntime(nextRuntime);
    setIsStreamingReply(true);

    const assistantMessage = createMessage("assistant", "", referenceSummary);
    const frames = buildRevealFrames(reply);

    setMessages((current) => [...current, assistantMessage].slice(-MAX_STORED_MESSAGES));

    return new Promise<ChatMessage>((resolve) => {
      let frameIndex = 0;

      const showNextFrame = () => {
        const content = frames[frameIndex] ?? reply;

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  content,
                }
              : message,
          ),
        );

        frameIndex += 1;

        if (frameIndex < frames.length) {
          revealTimeoutRef.current = window.setTimeout(showNextFrame, 45);
          return;
        }

        revealTimeoutRef.current = null;
        setIsStreamingReply(false);
        resolve({
          ...assistantMessage,
          content: reply,
        });
      };

      showNextFrame();
    });
  }

  async function sendMessage(rawMessage: string, options?: { retry?: boolean }) {
    const trimmed = rawMessage.trim();

    if (!trimmed || isLoading || isStreamingReply) {
      return;
    }

    const shouldRetry = options?.retry ?? false;
    const nextHistory = shouldRetry
      ? messages
      : [...messages, createMessage("user", trimmed)].slice(-MAX_STORED_MESSAGES);

    if (!shouldRetry) {
      setMessages(nextHistory);
    }

    setInput("");
    setError(null);
    setLastSubmittedMessage(trimmed);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bodyId: body.id,
          message: trimmed,
          history: nextHistory,
        }),
      });

      const data = (await response.json()) as ChatResponse | ChatErrorResponse;

      if (!response.ok) {
        throw new Error("error" in data ? data.error ?? "星星暂时没有回应。" : "星星暂时没有回应。");
      }

      if (!("reply" in data)) {
        throw new Error("星星暂时没有回应。");
      }

      setIsLoading(false);
      await revealAssistantReply(data.reply, data.relatedSummary, data.runtime);
    } catch (requestError) {
      clearRevealTimer();
      setIsStreamingReply(false);
      const message = requestError instanceof Error ? requestError.message : "星星暂时没有回应。";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function clearConversation() {
    clearRevealTimer();
    setMessages([]);
    setInput("");
    setError(null);
    setLastSubmittedMessage(null);
    setIsStreamingReply(false);

    try {
      window.localStorage.removeItem(getStorageKey(body.id));
    } catch {
      // Ignore local storage failures and keep the child experience usable.
    }
  }

  return (
    <div className="mt-5 space-y-5">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/25 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-sky-200">对话区</p>
            <h2 className="mt-1 text-xl font-semibold text-white">和 {body.name} 开始聊天</h2>
          </div>
          <button
            type="button"
            onClick={clearConversation}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
          >
            清空对话
          </button>
        </div>

        <div className="mt-4 rounded-3xl border border-sky-200/10 bg-sky-300/10 p-4 text-sm leading-7 text-sky-50">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-sky-200">星星怎样认真回答</p>
            <span className="rounded-full border border-sky-100/20 bg-white/10 px-3 py-1 text-xs text-white">
              {runtime.label}
            </span>
          </div>
          <p className="mt-2">{runtime.detail}</p>
          <p className="mt-2">
            每次回复都会先参考已经整理好的知识卡片。如果资料不够，星星会直接说“不确定”，不乱编答案。
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {hasHydrated && messages.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
              <p>星星正在等你先开口。你也可以点下面的小问题开始。</p>
              <p className="mt-2 text-slate-400">问一个你真的好奇的问题，星星会慢慢回答。</p>
            </div>
          ) : null}

          {!hasHydrated ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
              正在恢复你最近的对话记录……
            </div>
          ) : null}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-3xl p-4 text-sm leading-7 ${
                message.role === "user"
                  ? "ml-8 bg-sky-300 text-slate-950"
                  : "mr-8 bg-white/5 text-slate-100"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] opacity-70">
                <p>{message.role === "user" ? "你" : body.name}</p>
                {message.role === "assistant" && supportsVoicePlayback ? (
                  <button
                    type="button"
                    onClick={() => playAssistantMessage(message)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] normal-case tracking-normal"
                  >
                    {speakingMessageId === message.id ? "停止朗读" : "朗读"}
                  </button>
                ) : null}
              </div>
              <p>{message.content}</p>

              {message.role === "assistant" && message.referenceSummary ? (
                <div className="mt-3 rounded-2xl border border-sky-200/10 bg-sky-300/10 p-3 text-xs leading-6 text-sky-50">
                  <p className="text-sky-200">回答依据</p>
                  <p className="mt-1">{message.referenceSummary}</p>
                  <a href={`/knowledge/${body.id}`} className="mt-2 inline-flex text-sky-100 underline">
                    查看完整知识卡片
                  </a>
                </div>
              ) : null}
            </div>
          ))}

          {isLoading ? (
            <div className="mr-8 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-100">
              星星正在整理光芒……
            </div>
          ) : null}

          {isStreamingReply ? (
            <div className="mr-8 rounded-3xl border border-sky-200/10 bg-sky-300/10 p-4 text-sm leading-7 text-sky-50">
              星星正在轻声回应你……
            </div>
          ) : null}

          {error ? (
            <div className="rounded-3xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm leading-7 text-rose-100">
              <p>{error}</p>
              {lastSubmittedMessage ? (
                <button
                  type="button"
                  onClick={() => void sendMessage(lastSubmittedMessage, { retry: true })}
                  className="mt-3 rounded-2xl border border-rose-200/30 bg-white/10 px-4 py-2 text-sm text-white"
                >
                  重试刚才的问题
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {body.suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => void sendMessage(question)}
              className="rounded-full border border-sky-200/10 bg-sky-300/10 px-4 py-2 text-left text-sm text-sky-100"
            >
              {question}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-5 text-slate-300">
            <p>
              如果浏览器支持，可以用声音提问，也可以让星星把回答读出来；不支持时，文字聊天一样好用。
            </p>
            <span className="shrink-0 rounded-full border border-sky-200/10 bg-sky-300/10 px-3 py-1 text-sky-100">
              {supportsVoiceInput || supportsVoicePlayback ? "语音可用" : "文字模式"}
            </span>
          </div>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={placeholder}
            maxLength={300}
            rows={4}
            className="w-full rounded-3xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">最近 20 条对话只保存在这台设备里，方便你下次继续聊。</p>
            <div className="flex shrink-0 items-center gap-2">
              {supportsVoiceInput ? (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startVoiceInput}
                  disabled={isLoading || isStreamingReply || !hasHydrated}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white disabled:opacity-60"
                >
                  {isListening ? "停止听写" : "语音输入"}
                </button>
              ) : null}
              <button
                type="submit"
                disabled={isLoading || isStreamingReply || !hasHydrated}
                className="rounded-2xl bg-sky-300 px-5 py-3 text-sm font-medium text-slate-950 disabled:opacity-60"
              >
                发送
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-sky-200/10 bg-sky-300/10 p-5 text-sm leading-7 text-sky-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-sky-200">当前知识依据</p>
            <p className="mt-2">{knowledgeSummary}</p>
          </div>
          <a
            href="/wish"
            className="shrink-0 rounded-2xl border border-sky-100/20 bg-white/10 px-4 py-3 text-sm text-white"
          >
            写愿望卡
          </a>
          <a
            href={`/knowledge/${body.id}`}
            className="shrink-0 rounded-2xl border border-sky-100/20 bg-white/10 px-4 py-3 text-sm text-white"
          >
            打开知识卡片
          </a>
        </div>
      </section>
    </div>
  );
}
