"use client";

import { useEffect, useMemo, useState } from "react";

import type { CelestialCategory } from "@/types/celestial";
import { categoryLabels } from "@/data/celestial-bodies";
import { loadExplorationMemory } from "@/lib/exploration-memory";
import type { ExplorationMemoryEntry } from "@/types/exploration";

export type SelectionFilter = "all" | "featured" | CelestialCategory;

interface CelestialSelectionBody {
  id: string;
  name: string;
  type: string;
  category: CelestialCategory;
  avatar: string;
  tagline: string;
  personality: string;
  tags: string[];
  suggestedQuestions: string[];
}

interface CelestialSelectionProps {
  bodies: CelestialSelectionBody[];
  activeCategory: SelectionFilter;
}

const categories: SelectionFilter[] = [
  "all",
  "featured",
  "solar-system",
  "minor-body",
  "star",
  "constellation",
  "deep-space",
  "exoplanet",
];

const guestAvatars = ["🌟", "🌙", "🛰️", "🔭", "☄️"];
const nicknameStorageKey = "stars-saying-guest-nickname";
const avatarStorageKey = "stars-saying-guest-avatar";
const favoritesStorageKey = "stars-saying-favorites";

export function CelestialSelection({
  bodies,
  activeCategory,
}: CelestialSelectionProps) {
  const [nickname, setNickname] = useState("观星者");
  const [selectedAvatar, setSelectedAvatar] = useState(guestAvatars[0]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [memoryEntries, setMemoryEntries] = useState<ExplorationMemoryEntry[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedNickname = window.localStorage.getItem(nicknameStorageKey);
      const savedAvatar = window.localStorage.getItem(avatarStorageKey);
      const savedFavorites = window.localStorage.getItem(favoritesStorageKey);

      if (savedNickname) {
        setNickname(savedNickname);
      }

      if (savedAvatar && guestAvatars.includes(savedAvatar)) {
        setSelectedAvatar(savedAvatar);
      }

      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites) as string[];

        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed.filter((value) => typeof value === "string"));
        }
      }

      setMemoryEntries(loadExplorationMemory());
    } catch {
      setFavoriteIds([]);
      setMemoryEntries([]);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(nicknameStorageKey, nickname);
      window.localStorage.setItem(avatarStorageKey, selectedAvatar);
      window.localStorage.setItem(favoritesStorageKey, JSON.stringify(favoriteIds));
    } catch {
      // Ignore local storage failures and keep the child experience usable.
    }
  }, [favoriteIds, hasHydrated, nickname, selectedAvatar]);

  const favoriteBodies = useMemo(
    () => bodies.filter((body) => favoriteIds.includes(body.id)),
    [bodies, favoriteIds],
  );

  const groupedBodies = useMemo(() => {
    const groups: Array<{
      key: string;
      title: string;
      description: string;
      bodies: CelestialSelectionBody[];
    }> = [
      {
        key: "featured",
        title: "推荐星星",
        description: "适合先开始聊天的星体朋友。",
        bodies: bodies.filter((body) => favoriteIds.includes(body.id)).length
          ? bodies.filter((body) => favoriteIds.includes(body.id))
          : bodies.slice(0, 8),
      },
      {
        key: "solar-system",
        title: "太阳系朋友",
        description: "行星、卫星和太阳系里的小天体。",
        bodies: bodies.filter((body) => body.category === "solar-system" || body.category === "minor-body"),
      },
      {
        key: "far-sky",
        title: "远方星空",
        description: "恒星、星座、星云、星系和系外行星。",
        bodies: bodies.filter((body) =>
          ["star", "constellation", "deep-space", "exoplanet"].includes(body.category),
        ),
      },
    ];

    if (activeCategory !== "all") {
      return [
        {
          key: activeCategory,
          title: activeCategory === "featured" ? "推荐星星" : categoryLabels[activeCategory],
          description: "当前筛选下的星体朋友。",
          bodies,
        },
      ];
    }

    return groups.filter((group) => group.bodies.length > 0);
  }, [activeCategory, bodies, favoriteIds]);

  function toggleFavorite(bodyId: string) {
    setFavoriteIds((current) =>
      current.includes(bodyId)
        ? current.filter((id) => id !== bodyId)
        : [...current, bodyId],
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[1.75rem] border border-sky-200/10 bg-sky-300/10 p-5 text-sky-50">
        <div className="flex items-start gap-4">
          <button
            type="button"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-100/20 bg-white/10 text-3xl breathing-avatar"
          >
            {selectedAvatar}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-sky-200">我的小星标</p>
            <h2 className="mt-1 text-lg font-semibold text-white">{nickname}，今晚想先认识哪颗星？</h2>
            <p className="mt-2 text-sm leading-6 text-sky-100/90">
              你的昵称、头像和收藏只保存在这台设备里，方便下次继续找星星。
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          <label className="space-y-2 text-sm">
            <span className="text-sky-200">昵称</span>
            <input
              value={nickname}
              maxLength={12}
              onChange={(event) => setNickname(event.target.value.trimStart() || "观星者")}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none placeholder:text-slate-400"
              placeholder="给自己起一个星空昵称"
            />
          </label>

          <div className="space-y-2">
            <p className="text-sm text-sky-200">头像</p>
            <div className="flex flex-wrap gap-2">
              {guestAvatars.map((avatar) => {
                const isActive = avatar === selectedAvatar;

                return (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-xl transition ${
                      isActive
                        ? "border-sky-100 bg-white/15"
                        : "border-white/10 bg-slate-950/20"
                    }`}
                  >
                    {avatar}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {favoriteBodies.length > 0 ? (
        <section className="rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-sky-200">我的收藏</p>
              <h2 className="mt-1 text-lg font-semibold text-white">快速回到你标记过的星体</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {favoriteBodies.length} 个收藏
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {favoriteBodies.map((body) => (
              <a
                key={body.id}
                href={`/chat/${body.id}`}
                className="rounded-full border border-sky-200/10 bg-sky-300/10 px-4 py-2 text-sm text-sky-100"
              >
                {body.avatar} {body.name}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {hasHydrated && memoryEntries.length > 0 ? (
        <section className="rounded-[1.75rem] border border-amber-200/20 bg-amber-200/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-amber-100">你抽到的星星</p>
              <h2 className="mt-1 text-lg font-semibold text-white">记忆库里的星体也能聊天</h2>
            </div>
            <a href="/explore" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">
              继续抽星
            </a>
          </div>
          <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
            {memoryEntries.map((entry) => (
              <article
                key={entry.id}
                className="min-w-[82%] snap-start rounded-3xl border border-white/10 bg-slate-950/25 p-4"
              >
                <p className="text-xs text-amber-100">{categoryLabels[entry.category]} · {entry.type}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {entry.avatar} {entry.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-amber-50/90">
                  {entry.generated.summary}
                </p>
                <a
                  href={`/memory/${entry.id}/chat`}
                  className="mt-4 block rounded-2xl bg-amber-300 px-4 py-3 text-center text-sm font-semibold text-slate-950"
                >
                  和它聊天
                </a>
              </article>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-amber-50/75">
            这些星体来自随机抽星，保存在这台设备里，所以会显示在这里而不是固定星体图鉴里。
          </p>
        </section>
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <a
              key={category}
              href={category === "all" ? "/chat" : `/chat?category=${category}`}
              className={`rounded-full border px-4 py-2 text-sm whitespace-nowrap transition ${
                isActive
                  ? "border-sky-200 bg-sky-300 text-slate-950"
                  : "border-white/10 bg-white/5 text-slate-200"
              }`}
            >
              {categoryLabels[category]}
            </a>
          );
        })}
      </div>

      {bodies.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-slate-950/20 p-6 text-sm leading-7 text-slate-300">
          这一组星体还在整理星轨中。先试试“推荐”或“全部”，更快进入演示主流程。
        </div>
      ) : null}

      <div className="space-y-5">
        {groupedBodies.map((group) => (
          <section key={group.key} className="rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-sky-200">{group.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{group.description}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                左右滑动
              </span>
            </div>

            <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
              {group.bodies.map((body) => {
                const isFavorite = favoriteIds.includes(body.id);

                return (
                  <article
                    key={`${group.key}-${body.id}`}
                    className={`min-w-[82%] snap-start rounded-3xl border bg-slate-950/30 p-4 shadow-lg transition ${
                      isFavorite ? "border-amber-200/30 active-celestial-glow" : "border-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl breathing-avatar">
                        {body.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-sky-200">{categoryLabels[body.category]} · {body.type}</p>
                        <h3 className="mt-1 text-xl font-semibold text-white">{body.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-200/90">{body.tagline}</p>
                      </div>
                    </div>

                    <details className="mt-4 rounded-2xl bg-white/5 px-4 py-3">
                      <summary className="cursor-pointer text-sm text-white">问题和性格</summary>
                      <p className="mt-3 text-xs leading-5 text-slate-300">星星性格：{body.personality}</p>
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {body.suggestedQuestions.map((question) => (
                          <span
                            key={question}
                            className="min-w-[78%] rounded-2xl border border-sky-200/10 bg-sky-300/10 px-3 py-2 text-xs leading-5 text-sky-100"
                          >
                            {question}
                          </span>
                        ))}
                      </div>
                    </details>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(body.id)}
                        className={`rounded-2xl border px-4 py-3 text-sm transition ${
                          isFavorite
                            ? "border-amber-200/30 bg-amber-300/15 text-amber-100"
                            : "border-white/10 bg-white/5 text-slate-200"
                        }`}
                      >
                        {isFavorite ? "已收藏" : "收藏"}
                      </button>
                      <a
                        href={`/chat/${body.id}`}
                        className="rounded-2xl bg-sky-300 px-4 py-3 text-center text-sm font-medium text-slate-950"
                      >
                        对话
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
