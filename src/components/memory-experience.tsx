"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { categoryLabels } from "@/data/celestial-bodies";
import { loadExplorationMemory, saveExplorationMemory } from "@/lib/exploration-memory";
import { stopSpeech } from "@/lib/speech";
import { useGentleSpeech } from "@/lib/use-gentle-speech";
import type { ExplorationMemoryEntry } from "@/types/exploration";

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

export function MemoryExperience() {
  const [entries, setEntries] = useState<ExplorationMemoryEntry[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<Record<string, string>>({});
  const [activeListeningId, setActiveListeningId] = useState<string | null>(null);
  const [activeAnsweringId, setActiveAnsweringId] = useState<string | null>(null);
  const [supportsVoiceInput, setSupportsVoiceInput] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speech = useGentleSpeech();

  useEffect(() => {
    setEntries(loadExplorationMemory());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    setSupportsVoiceInput(Boolean(speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition));

    return () => {
      recognitionRef.current?.stop();
      stopSpeech();
    };
  }, []);

  function removeEntry(entryId: string) {
    const nextEntries = entries.filter((entry) => entry.id !== entryId);
    setEntries(nextEntries);
    saveExplorationMemory(nextEntries);
  }

  async function ask(entry: ExplorationMemoryEntry, question: string) {
    const trimmed = question.trim();

    if (!trimmed) {
      setAnswers((current) => ({
        ...current,
        [entry.id]: `${entry.name}轻轻闪了一下：你可以问我“我最特别的地方是什么”。`,
      }));
      return;
    }

    setActiveAnsweringId(entry.id);

    try {
      const response = await fetch("/api/explore/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry,
          question: trimmed,
        }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "这颗星暂时没有回答。");
      }

      setAnswers((current) => ({ ...current, [entry.id]: data.reply ?? "" }));
      setQuestions((current) => ({ ...current, [entry.id]: "" }));
      speech.play(`${entry.id}:answer`, data.reply);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "这颗星暂时没有回答。";
      setAnswers((current) => ({ ...current, [entry.id]: message }));
    } finally {
      setActiveAnsweringId(null);
    }
  }

  function updateQuestion(entryId: string, value: string) {
    setQuestions((current) => ({ ...current, [entryId]: value.slice(0, 160) }));
  }

  function stopListening() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setActiveListeningId(null);
  }

  function startListening(entryId: string) {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      return;
    }

    if (activeListeningId === entryId) {
      stopListening();
      return;
    }

    stopListening();
    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();

      if (transcript) {
        updateQuestion(entryId, `${questions[entryId] ?? ""}${questions[entryId] ? " " : ""}${transcript}`);
      }
    };
    recognition.onerror = () => setActiveListeningId(null);
    recognition.onend = () => setActiveListeningId(null);
    recognitionRef.current = recognition;
    setActiveListeningId(entryId);
    recognition.start();
  }

  if (!hasHydrated) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
        正在读取记忆库……
      </section>
    );
  }

  if (!entries.length) {
    return (
      <EmptyState
        icon="🔭"
        title="记忆库还是空的"
        description="先去星体探索器随机抽一颗星，APP 会把它的科普说明和专属性格放到这里。"
        actionLabel="去随机抽星"
        actionHref="/explore"
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[1.75rem] border border-emerald-200/20 bg-emerald-200/10 p-5 text-sm leading-7 text-emerald-50">
        收藏了 {entries.length} 位星星朋友。都在这里，随时回来看。
      </section>

      <section className="flex snap-x gap-4 overflow-x-auto pb-3">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="min-w-[88%] snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 shadow-lg"
          >
            {entry.imageUrl ? (
              <div className="relative h-44 w-full">
                <Image
                  src={entry.imageUrl}
                  alt={`${entry.name}的图片`}
                  fill
                  sizes="(max-width: 768px) 88vw, 380px"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="p-5">
              <p className="text-xs text-sky-200">{categoryLabels[entry.category]} · {entry.type}</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                {entry.avatar} {entry.name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-sky-50/90">{entry.generated.summary}</p>

              <details className="mt-4 rounded-2xl bg-white/5 px-4 py-3">
                <summary className="cursor-pointer text-sm text-white">性格和资料</summary>
                <div className="mt-3 space-y-3 text-sm leading-7 text-slate-200">
                  <p>{entry.generated.personality}</p>
                  {entry.facts.slice(0, 3).map((fact) => (
                    <p key={`${fact.label}-${fact.value}`} className="rounded-2xl bg-white/8 px-4 py-3">
                      <span className="text-sky-200">{fact.label}：</span>
                      {fact.value}
                    </p>
                  ))}
                </div>
              </details>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => speech.play(`${entry.id}:voice`, entry.generated.voiceLine)}
                  className="rounded-2xl bg-sky-300 px-4 py-3 text-sm font-semibold text-slate-950"
                >
                  {speech.activeSpeechId === `${entry.id}:voice` ? "停止介绍" : "听它介绍"}
                </button>
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                >
                  移除
                </button>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {entry.generated.suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void ask(entry, question)}
                    disabled={activeAnsweringId === entry.id}
                    className="min-w-[78%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm leading-6 text-white"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void ask(entry, questions[entry.id] ?? "");
                }}
                className="mt-4 rounded-3xl border border-sky-200/10 bg-sky-300/10 p-4"
              >
                <label className="block text-sm text-sky-100">
                  <span>自己问一句</span>
                  <input
                    value={questions[entry.id] ?? ""}
                    onChange={(event) => updateQuestion(entry.id, event.target.value)}
                    placeholder={`问问${entry.name}：你最特别的地方是什么？`}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
                    maxLength={160}
                  />
                </label>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {supportsVoiceInput ? (
                    <button
                      type="button"
                      onClick={() => startListening(entry.id)}
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white"
                    >
                      {activeListeningId === entry.id ? "停止听写" : "语音提问"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => speech.play(`${entry.id}:greeting`, entry.generated.greeting)}
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white"
                    >
                      {speech.activeSpeechId === `${entry.id}:greeting` ? "停止问候" : "听问候"}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={activeAnsweringId === entry.id}
                    className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950"
                  >
                    {activeAnsweringId === entry.id ? "正在回答" : "问这颗星"}
                  </button>
                </div>
                <p className="mt-3 text-xs leading-5 text-sky-50/75">
                  星星会记住自己的故事来回答你，不会问你的真实姓名和联系方式。
                </p>
              </form>

              {answers[entry.id] ? (
                <p className="mt-3 rounded-3xl bg-amber-200/15 p-4 text-sm leading-7 text-amber-50">
                  {answers[entry.id]}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
