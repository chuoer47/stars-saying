"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { celestialBodies } from "@/data/celestial-bodies";

interface WishRecord {
  id: string;
  bodyId: string;
  wish: string;
  reply: string;
  createdAt: string;
}

const wishStorageKey = "stars-saying-wishes";
const blockedWishPattern = /自杀|轻生|伤害自己|伤害别人|杀|炸|毒品|赌博|色情|暴力|仇恨|诅咒|报复|违法|血腥|地址|电话|手机号|学校|班级|微信|qq|邮箱|身份证/i;
const phonePattern = /1[3-9]\d{9}|\d{3,4}[-\s]?\d{7,8}/;
const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

function loadWishes() {
  try {
    const saved = window.localStorage.getItem(wishStorageKey);
    const parsed = saved ? (JSON.parse(saved) as WishRecord[]) : [];

    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.id === "string" && typeof item.wish === "string")
      : [];
  } catch {
    return [];
  }
}

function saveWishes(wishes: WishRecord[]) {
  window.localStorage.setItem(wishStorageKey, JSON.stringify(wishes.slice(0, 12)));
}

function isSafeForWall(wish: string) {
  return !blockedWishPattern.test(wish) && !phonePattern.test(wish) && !emailPattern.test(wish);
}

function getBody(bodyId: string) {
  return celestialBodies.find((body) => body.id === bodyId) ?? celestialBodies[0];
}

export function WishWallExperience() {
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setWishes(loadWishes());
    setHasHydrated(true);
  }, []);

  const visibleWishes = useMemo(
    () => wishes.filter((record) => isSafeForWall(record.wish)).slice(0, 12),
    [wishes],
  );
  const hiddenCount = Math.max(0, wishes.length - visibleWishes.length);

  function removeWish(recordId: string) {
    const nextWishes = wishes.filter((record) => record.id !== recordId);
    setWishes(nextWishes);
    saveWishes(nextWishes);
  }

  function clearWall() {
    setWishes([]);
    saveWishes([]);
  }

  async function copyWish(record: WishRecord) {
    const body = getBody(record.bodyId);
    const text = `星空愿望墙\n${body.avatar} ${body.name}收到一个愿望：${record.wish}\n${record.reply}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(record.id);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[1.75rem] border border-emerald-200/20 bg-emerald-200/10 p-5 text-sm leading-7 text-emerald-50">
        <p className="text-sm font-medium text-emerald-100">愿望墙规则</p>
        <p className="mt-2">
          愿望卡只在这里展示，不会跑到别的地方去。写有电话、学校、地址或让人不舒服的内容不会出现。
        </p>
      </section>

      {hiddenCount > 0 ? (
        <section className="rounded-[1.75rem] border border-amber-200/20 bg-amber-200/10 p-5 text-sm leading-7 text-amber-50">
          有 {hiddenCount} 条愿望没有展示。可以回到愿望卡页面，把它改写成更安全、不要包含个人信息的版本。
        </section>
      ) : null}

      {!hasHydrated ? (
        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
          正在把愿望星星摆到墙上……
        </section>
      ) : null}

      {hasHydrated && visibleWishes.length === 0 ? (
        <EmptyState
          icon="🌈"
          title="愿望墙还空着"
          description="先做一张愿望卡，星星的回应就会来到这里。"
          actionLabel="去生成愿望卡"
          actionHref="/wish"
        />
      ) : null}

      {visibleWishes.length > 0 ? (
        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-sky-100">墙上有 {visibleWishes.length} 颗愿望星</p>
            <button
              type="button"
              onClick={clearWall}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white"
            >
              清空本机愿望墙
            </button>
          </div>

          {visibleWishes.map((record, index) => {
            const body = getBody(record.bodyId);

            return (
              <article
                key={record.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                      {body.avatar}
                    </div>
                    <div>
                      <p className="text-xs text-sky-200">第 {index + 1} 颗愿望星</p>
                      <h2 className="text-lg font-semibold text-white">{body.name}守护的愿望</h2>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWish(record.id)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                  >
                    移除
                  </button>
                </div>

                <p className="mt-4 rounded-2xl bg-amber-200/15 px-4 py-3 text-base leading-7 text-amber-50">
                  {record.wish}
                </p>
                <p className="mt-3 text-sm leading-7 text-sky-50/90">
                  {record.reply}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void copyWish(record)}
                    className="rounded-2xl bg-sky-300 px-4 py-3 text-sm font-medium text-slate-950"
                  >
                    {copiedId === record.id ? "已复制" : "复制这颗愿望星"}
                  </button>
                  <a
                    href={`/chat/${body.id}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                  >
                    去找{body.name}聊天
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}
