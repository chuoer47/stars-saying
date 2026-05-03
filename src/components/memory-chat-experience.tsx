"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { loadExplorationMemory } from "@/lib/exploration-memory";
import { stopSpeech } from "@/lib/speech";
import { useGentleSpeech } from "@/lib/use-gentle-speech";
import type { ExplorationMemoryEntry } from "@/types/exploration";

interface MemoryChatMessage {
  id: string;
  role: "child" | "star";
  content: string;
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

function createMessage(role: MemoryChatMessage["role"], content: string): MemoryChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

function getChatStorageKey(entryId: string) {
  return `stars-saying-memory-chat:${entryId}`;
}

interface MemoryChatExperienceProps {
  entryId: string;
}

export function MemoryChatExperience({ entryId }: MemoryChatExperienceProps) {
  const [entry, setEntry] = useState<ExplorationMemoryEntry | null>(null);
  const [messages, setMessages] = useState<MemoryChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [supportsVoiceInput, setSupportsVoiceInput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speech = useGentleSpeech();

  const suggestedQuestions = useMemo(
    () => entry?.generated.suggestedQuestions ?? [],
    [entry?.generated.suggestedQuestions],
  );

  useEffect(() => {
    const savedEntry = loadExplorationMemory().find((item) => item.id === entryId) ?? null;
    const speechWindow = window as SpeechWindow;

    setEntry(savedEntry);
    setSupportsVoiceInput(Boolean(speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition));

    try {
      const savedMessages = window.localStorage.getItem(getChatStorageKey(entryId));
      const parsed = savedMessages ? (JSON.parse(savedMessages) as MemoryChatMessage[]) : [];

      if (Array.isArray(parsed) && parsed.length) {
        setMessages(parsed.slice(-20));
      } else if (savedEntry) {
        setMessages([createMessage("star", savedEntry.generated.greeting)]);
      }
    } catch {
      if (savedEntry) {
        setMessages([createMessage("star", savedEntry.generated.greeting)]);
      }
    } finally {
      setHasHydrated(true);
    }

    return () => {
      recognitionRef.current?.stop();
      stopSpeech();
    };
  }, [entryId]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(getChatStorageKey(entryId), JSON.stringify(messages.slice(-20)));
    } catch {
      // Local memory chat should never block the child experience.
    }
  }, [entryId, hasHydrated, messages]);

  function stopListening() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }

  function startListening() {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();

      if (transcript) {
        setInput((current) => `${current}${current ? " " : ""}${transcript}`.slice(0, 180));
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }

  async function sendQuestion(rawQuestion: string) {
    const question = rawQuestion.trim();

    if (!entry || !question) {
      return;
    }

    setIsAnswering(true);
    const nextMessages = [
      ...messages,
      createMessage("child", question),
    ].slice(-20);

    setMessages(nextMessages);
    setInput("");

    try {
      const response = await fetch("/api/explore/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry,
          question,
        }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "这颗星暂时没有回答。");
      }

      setMessages((current) => [...current, createMessage("star", data.reply ?? "")].slice(-20));
      speech.play("latest-answer", data.reply);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "这颗星暂时没有回答。";
      setMessages((current) => [...current, createMessage("star", message)].slice(-20));
    } finally {
      setIsAnswering(false);
    }
  }

  function clearChat() {
    if (!entry) {
      return;
    }

    const greeting = createMessage("star", entry.generated.greeting);
    setMessages([greeting]);

    try {
      window.localStorage.removeItem(getChatStorageKey(entry.id));
    } catch {
      // Ignore local storage failures.
    }
  }

  if (!entry && hasHydrated) {
    return (
      <section className="rounded-[2rem] border border-dashed border-white/15 bg-white/8 p-6 text-sm leading-7 text-slate-200">
        <p className="text-lg font-semibold text-white">没有找到这颗星</p>
        <p className="mt-2">它可能还没有被抽到，或者已经从本机记忆库里移除了。</p>
        <a href="/explore" className="mt-4 inline-flex rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950">
          去随机抽星
        </a>
      </section>
    );
  }

  if (!entry) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/8 p-6 text-sm text-slate-200">
        正在打开这颗星的记忆……
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-white/10 bg-white/8 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-sky-200">记忆库星体聊天</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              {entry.avatar} {entry.name}
            </h2>
            <p className="mt-2 text-sm leading-7 text-sky-50/85">{entry.generated.summary}</p>
          </div>
          <button
            type="button"
            onClick={() => speech.play("entry-voice", entry.generated.voiceLine)}
            className="shrink-0 rounded-2xl bg-sky-300 px-4 py-3 text-sm font-semibold text-slate-950"
          >
            {speech.activeSpeechId === "entry-voice" ? "停止介绍" : "听介绍"}
          </button>
        </div>
        <details className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          <summary className="cursor-pointer text-sm text-white">看看它的资料和性格</summary>
          <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-2">
            <article className="min-w-[82%] snap-start rounded-2xl bg-sky-300/10 p-4 text-sm leading-7 text-sky-50">
              <p className="text-sky-200">专属性格</p>
              <p className="mt-2">{entry.generated.personality}</p>
            </article>
            {entry.facts.slice(0, 3).map((fact) => (
              <article key={`${fact.label}-${fact.value}`} className="min-w-[82%] snap-start rounded-2xl bg-amber-300/10 p-4 text-sm leading-7 text-amber-50">
                <p className="text-amber-100">{fact.label}</p>
                <p className="mt-2">{fact.value}</p>
                <p className="mt-2 text-xs text-amber-50/70">{fact.source}</p>
              </article>
            ))}
          </div>
        </details>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-950/25 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-sky-200">聊天记录</p>
          <button
            type="button"
            onClick={clearChat}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
          >
            清空
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-3xl p-4 text-sm leading-7 ${
                message.role === "child"
                  ? "ml-8 bg-amber-300 text-slate-950"
                  : "mr-8 bg-white/8 text-sky-50"
              }`}
            >
              <div className="mb-2 flex items-center justify-between text-xs opacity-75">
                <span>{message.role === "child" ? "你" : entry.name}</span>
                {message.role === "star" ? (
                  <button
                    type="button"
                    onClick={() => speech.play(message.id, message.content)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                  >
                    {speech.activeSpeechId === message.id ? "停止" : "朗读"}
                  </button>
                ) : null}
              </div>
              <p>{message.content}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => void sendQuestion(question)}
              disabled={isAnswering}
              className="min-w-[72%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm leading-6 text-white"
            >
              {question}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void sendQuestion(input);
          }}
          className="mt-4 space-y-3"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, 180))}
            placeholder={`问问${entry.name}一个问题`}
            rows={3}
            className="w-full rounded-3xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs leading-5 text-slate-400">回答来自这颗星在本机记忆库里的资料和性格。</p>
            <div className="flex shrink-0 gap-2">
              {supportsVoiceInput ? (
                <button
                  type="button"
                  onClick={startListening}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                >
                  {isListening ? "停止听写" : "语音"}
                </button>
              ) : null}
              <button
                type="submit"
                disabled={isAnswering}
                className="rounded-2xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950"
              >
                {isAnswering ? "正在回答" : "发送"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
