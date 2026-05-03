"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { categoryLabels } from "@/data/celestial-bodies";
import { loadExplorationMemory, upsertExplorationMemory } from "@/lib/exploration-memory";
import { useGentleSpeech } from "@/lib/use-gentle-speech";
import type { ExplorationMemoryEntry } from "@/types/exploration";

interface ExploreRandomResponse {
  entry: ExplorationMemoryEntry;
  model: string;
}

export function ExploreExperience() {
  const [entry, setEntry] = useState<ExplorationMemoryEntry | null>(null);
  const [memory, setMemory] = useState<ExplorationMemoryEntry[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelLabel, setModelLabel] = useState("local-fallback");
  const speech = useGentleSpeech();

  useEffect(() => {
    setMemory(loadExplorationMemory());
  }, []);

  const exclude = useMemo(() => memory.map((item) => item.id).join(","), [memory]);

  async function drawStar() {
    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch(`/api/explore/random${exclude ? `?exclude=${encodeURIComponent(exclude)}` : ""}`);

      if (!response.ok) {
        throw new Error("抽星失败");
      }

      const data = (await response.json()) as ExploreRandomResponse;
      setEntry(data.entry);
      setModelLabel(data.model);
      setMemory(upsertExplorationMemory(data.entry));
    } catch {
      setError("星体探索器刚刚有点忙，请稍后再抽一次。");
    } finally {
      setIsLoading(false);
    }
  }

  async function ask(question: string) {
    if (!entry) {
      return;
    }

    setIsAnswering(true);
    setError(null);

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

      setAnswer(data.reply);
      speech.play(`${entry.id}:answer`, data.reply);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "这颗星暂时没有回答。";
      setAnswer(message);
    } finally {
      setIsAnswering(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-white/10 bg-white/8 p-5">
        <p className="text-sm text-sky-200">随机抽星</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">让官方资料库送来一颗新星体</h2>
        <p className="mt-3 text-sm leading-7 text-sky-50/85">
          每次抽取会读取 NASA/JPL/系外行星档案里的资料，再生成适合儿童理解的星体小性格，并自动放进本机记忆库。
        </p>
        <button
          type="button"
          onClick={() => void drawStar()}
          disabled={isLoading}
          className="mt-5 w-full rounded-2xl bg-amber-300 px-5 py-4 text-base font-semibold text-slate-950 disabled:opacity-60"
        >
          {isLoading ? "正在抽一颗星……" : "随机抽一颗星"}
        </button>
      </section>

      {error ? (
        <section className="rounded-[1.75rem] border border-rose-200/20 bg-rose-200/10 p-5 text-sm text-rose-50">
          {error}
        </section>
      ) : null}

      {!entry ? (
        <section className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm leading-7 text-slate-200">
          还没有抽星。点一下按钮，星体探索器会把一颗新的宇宙朋友带到这里。
        </section>
      ) : null}

      {entry ? (
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 shadow-2xl">
          {entry.imageUrl ? (
            <div className="relative h-56 w-full">
              <Image
                src={entry.imageUrl}
                alt={`${entry.name}的官方资料图片`}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-sky-200">{categoryLabels[entry.category]} · {entry.type}</p>
                <h2 className="mt-1 text-3xl font-semibold text-white">
                  {entry.avatar} {entry.name}
                </h2>
                <p className="mt-1 text-xs text-sky-100/70">{entry.englishName}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white">
                {entry.officialStatus === "live" ? "官方资料" : "本地备用"}
              </span>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-2 snap-x">
              <article className="min-w-[82%] snap-start rounded-3xl bg-amber-200/15 p-4 text-sm leading-7 text-amber-50">
                <p className="text-amber-100">科普说明</p>
                <p className="mt-2">{entry.generated.summary}</p>
              </article>
              <article className="min-w-[82%] snap-start rounded-3xl bg-sky-200/15 p-4 text-sm leading-7 text-sky-50">
                <p className="text-sky-100">专属性格</p>
                <p className="mt-2">{entry.generated.personality}</p>
              </article>
              <article className="min-w-[82%] snap-start rounded-3xl bg-emerald-200/15 p-4 text-sm leading-7 text-emerald-50">
                <p className="text-emerald-100">声音台词</p>
                <p className="mt-2">{entry.generated.voiceLine}</p>
              </article>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => speech.play(`${entry.id}:voice`, entry.generated.voiceLine)}
                className="rounded-2xl bg-sky-300 px-4 py-3 text-sm font-semibold text-slate-950"
              >
                {speech.activeSpeechId === `${entry.id}:voice` ? "停止星体声音" : "播放星体声音"}
              </button>
              <a
                href="/memory"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white"
              >
                打开记忆库
              </a>
            </div>

            <details className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-sm font-medium text-white">展开官方事实</summary>
              <dl className="mt-4 grid gap-3">
                {entry.facts.map((fact) => (
                  <div key={`${fact.label}-${fact.value}`} className="rounded-2xl bg-white/8 px-4 py-3 text-sm">
                    <dt className="text-sky-200">{fact.label}</dt>
                    <dd className="mt-1 text-white">{fact.value}</dd>
                    <dd className="mt-1 text-xs text-sky-100/70">{fact.source}</dd>
                  </div>
                ))}
              </dl>
            </details>

            <section className="mt-4">
              <p className="text-sm text-sky-200">可以这样问它</p>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {entry.generated.suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void ask(question)}
                    disabled={isAnswering}
                    className="min-w-[70%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm leading-6 text-white"
                  >
                    {question}
                  </button>
                ))}
              </div>
              {isAnswering ? (
                <div className="mt-3 rounded-3xl border border-sky-200/10 bg-sky-300/10 p-4 text-sm leading-7 text-sky-50">
                  这颗星正在认真回答……
                </div>
              ) : null}
              {answer ? (
                <div className="mt-3 rounded-3xl bg-sky-300/15 p-4 text-sm leading-7 text-sky-50">
                  {answer}
                </div>
              ) : null}
            </section>

            <p className="mt-4 text-xs leading-6 text-slate-400">
              已自动收录到本机记忆库。生成方式：{modelLabel === "local-fallback" ? "本地保底" : modelLabel}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
