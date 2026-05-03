"use client";

import { useMemo, useState } from "react";

import { celestialBodies, categoryLabels } from "@/data/celestial-bodies";
import { knowledgeCards } from "@/data/knowledge-cards";
import { semanticSearch } from "@/lib/retrieval";

type LibraryFilter = "all" | "body" | "concept" | "culture";

interface LibraryItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  keywords: string[];
  bodyId: string;
  searchableText: string;
}

const quickFilters: Array<{ value: LibraryFilter; label: string; hint: string }> = [
  { value: "all", label: "全部", hint: "浏览所有知识主题" },
  { value: "body", label: "星体", hint: "按星体与星群浏览" },
  { value: "concept", label: "概念", hint: "查找科学概念" },
  { value: "culture", label: "文化", hint: "查找文化故事" },
];

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function buildItems(): LibraryItem[] {
  return celestialBodies.flatMap((body) => {
    const card = knowledgeCards[body.id];
    const bodyKeywords = [body.name, body.type, body.category, ...body.tags, ...body.suggestedQuestions];
    const cardKeywords = card
      ? [card.summary, ...card.features, card.misconception, card.funFact, card.culture, ...card.sources]
      : [];

    const bodyItem: LibraryItem = {
      id: body.id,
      title: body.name,
      category: categoryLabels[body.category],
      summary: body.tagline,
      keywords: bodyKeywords,
      bodyId: body.id,
      searchableText: normalize([...bodyKeywords, body.tagline, body.personality, body.tone].join(" ")),
    };

    if (!card) {
      return [bodyItem];
    }

    return [
      bodyItem,
      {
        id: `${body.id}-science`,
        title: `${body.name} · 科学卡片`,
        category: "概念",
        summary: card.summary,
        keywords: [body.name, ...card.keyFacts.map((fact) => fact.label), ...card.features, card.misconception],
        bodyId: body.id,
        searchableText: normalize(cardKeywords.join(" ")),
      },
      {
        id: `${body.id}-culture`,
        title: `${body.name} · 文化与故事`,
        category: "文化",
        summary: card.culture,
        keywords: [body.name, card.culture, card.funFact],
        bodyId: body.id,
        searchableText: normalize([card.culture, card.funFact, ...body.tags].join(" ")),
      },
    ];
  });
}

export function KnowledgeLibraryExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LibraryFilter>("all");

  const items = useMemo(() => buildItems(), []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalize(query);

    return items.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "body" && item.category !== "概念" && item.category !== "文化") ||
        (filter === "concept" && item.category === "概念") ||
        (filter === "culture" && item.category === "文化");

      const matchesQuery =
        !normalizedQuery ||
        item.searchableText.includes(normalizedQuery) ||
        item.keywords.some((keyword) => normalize(keyword).includes(normalizedQuery));

      return matchesFilter && matchesQuery;
    });
  }, [filter, items, query]);

  const semanticResults = useMemo(() => semanticSearch(query, 5), [query]);

  const topKeywords = useMemo(() => {
    const seedKeywords = ["恒星", "行星", "月相", "彗星", "星云", "星系", "系外行星", "观星"];
    return seedKeywords.filter((keyword) =>
      items.some((item) => item.searchableText.includes(normalize(keyword))),
    );
  }, [items]);

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/25 p-5">
        <p className="text-sm text-sky-200">搜索知识</p>
        <label className="mt-3 block">
          <span className="sr-only">搜索星体、概念或文化关键词</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索星体名、概念、文化关键词，例如：土星环、月相、神话"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickFilters.map((item) => {
            const isActive = filter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-sky-200 bg-sky-300 text-slate-950"
                    : "border-white/10 bg-white/5 text-slate-200"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs leading-6 text-slate-400">
          你可以像翻图鉴一样找知识点，再回到对应星体卡片或对话页。
        </p>
      </section>

      {topKeywords.length > 0 ? (
        <section className="rounded-[1.75rem] border border-sky-200/10 bg-sky-300/10 p-5">
          <p className="text-sm text-sky-200">热门关键词</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {topKeywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white">
                {keyword}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {query.trim() ? (
        <section className="rounded-[1.75rem] border border-sky-200/10 bg-sky-300/10 p-5">
          <p className="text-sm text-sky-200">相近内容</p>
          <p className="mt-2 text-xs leading-6 text-sky-100/90">
            除了你输入的词，系统还会在本机资料里找意思相近的星体、课堂和故事；不需要上传查询。
          </p>
          <div className="mt-4 space-y-3">
            {semanticResults.length ? (
              semanticResults.map((result) => (
                <a key={result.id} href={result.href} className="block rounded-2xl bg-white/8 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-white">{result.title}</span>
                    <span className="text-xs text-sky-200">{Math.round(result.score * 100)}%</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-sky-50/90">{result.summary}</p>
                  {result.matchedTerms.length ? (
                    <p className="mt-2 text-[11px] text-sky-100/70">
                      匹配：{result.matchedTerms.join("、")}
                    </p>
                  ) : null}
                </a>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-sky-50/90">
                暂无语义联想结果，可以换一个更具体的词，例如“月相变化”或“北方导航”。
              </p>
            )}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <article key={item.id} className="rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.category}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.summary}</p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl text-white">
                  {celestialBodies.find((body) => body.id === item.bodyId)?.avatar}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.keywords.slice(0, 4).map((keyword) => (
                  <span key={keyword} className="rounded-full border border-sky-200/10 bg-sky-300/10 px-3 py-1 text-xs text-sky-100">
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`/knowledge/${item.bodyId}`}
                  className="rounded-2xl bg-sky-300 px-4 py-3 text-sm font-medium text-slate-950"
                >
                  打开知识卡片
                </a>
                <a
                  href={`/chat/${item.bodyId}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                >
                  去对话
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-slate-950/20 p-6 text-sm leading-7 text-slate-300">
            没有找到匹配内容。试试“月相”“土星环”“神话”“导航”等关键词。
          </div>
        )}
      </section>
    </div>
  );
}
