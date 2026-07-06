"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface OfficialAstronomyFact {
  label: string;
  value: string;
  source: string;
}

interface OfficialAstronomyImage {
  title: string;
  url: string;
  description: string;
  source: string;
}

interface OfficialAstronomyResult {
  status: "live" | "fallback";
  message: string;
  image?: OfficialAstronomyImage;
  todayImage?: OfficialAstronomyImage;
  facts: OfficialAstronomyFact[];
  sources: Array<{
    label: string;
    url: string;
  }>;
}

interface OfficialKnowledgePanelProps {
  bodyId: string;
  bodyName: string;
}

export function OfficialKnowledgePanel({ bodyId, bodyName }: OfficialKnowledgePanelProps) {
  const [data, setData] = useState<OfficialAstronomyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOfficialKnowledge() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/official-knowledge/${bodyId}`);

        if (!response.ok) {
          throw new Error("official fetch failed");
        }

        const result = (await response.json()) as OfficialAstronomyResult;

        if (isMounted) {
          setData(result);
        }
      } catch {
        if (isMounted) {
          setError("资料还在路上，先看看已有的知识卡片吧。");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadOfficialKnowledge();

    return () => {
      isMounted = false;
    };
  }, [bodyId]);

  if (isLoading) {
    return (
      <section className="rounded-[1.75rem] border border-sky-200/20 bg-sky-100/10 p-5 text-sm leading-7 text-sky-50">
        <p className="text-sm text-sky-200">补充小知识</p>
        <p className="mt-2">正在帮你收集更多有趣的知识……</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-[1.75rem] border border-amber-200/20 bg-amber-200/10 p-5 text-sm leading-7 text-amber-50">
        <p className="text-sm text-amber-100">补充小知识</p>
        <p className="mt-2">{error ?? "更多知识还在路上。"}</p>
      </section>
    );
  }

  const mainImage = data.image ?? data.todayImage;

  return (
    <section className="rounded-[1.75rem] border border-sky-200/20 bg-sky-100/10 p-5 text-sm leading-7 text-sky-50">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-sky-200">补充小知识</p>
          <h2 className="mt-1 text-lg font-semibold text-white">找到的一些有趣线索</h2>
        </div>
      </div>

      <p className="mt-3 text-sky-50/90">{data.message}</p>

      {mainImage ? (
        <figure className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/20">
          <div className="relative h-72 w-full">
            <Image
              src={mainImage.url}
              alt={`${bodyName}的图片：${mainImage.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover"
            />
          </div>
          <figcaption className="p-4">
            <p className="font-medium text-white">{mainImage.title}</p>
            <p className="mt-2 text-xs leading-6 text-sky-50/85">{mainImage.description}</p>
            <p className="mt-2 text-xs text-sky-200">{mainImage.source}</p>
          </figcaption>
        </figure>
      ) : null}

      {data.facts.length ? (
        <dl className="mt-4 grid gap-3">
          {data.facts.slice(0, 4).map((fact) => (
            <div key={`${fact.label}-${fact.value}`} className="rounded-2xl bg-white/10 px-4 py-3">
              <dt className="text-sky-200">{fact.label}</dt>
              <dd className="mt-1 text-white">{fact.value}</dd>
              <dd className="mt-1 text-xs text-sky-100/75">{fact.source}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <details className="mt-4 rounded-2xl bg-white/5 px-4 py-3">
        <summary className="cursor-pointer text-sm text-white">这些资料从哪里来？</summary>
        <div className="mt-3 space-y-2">
          {data.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="block text-xs leading-5 text-sky-100 underline"
            >
              {source.label}
            </a>
          ))}
        </div>
      </details>
    </section>
  );
}
