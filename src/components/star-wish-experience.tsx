"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { celestialBodies } from "@/data/celestial-bodies";

interface WishRecord {
  id: string;
  bodyId: string;
  wish: string;
  reply: string;
  createdAt: string;
}

const wishStorageKey = "stars-saying-wishes";
const unsafePattern = /自杀|轻生|伤害自己|伤害别人|杀|炸|毒品|赌博|色情|暴力|仇恨|诅咒|报复|违法|血腥/i;
const offTopicPattern = /股票|彩票|考试答案|代写|黑客|破解|攻击|赚钱|投资建议|政治立场/i;
const personalInfoPattern = /地址|电话|手机号|学校|班级|微信|qq|邮箱|身份证|1[3-9]\d{9}|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

function createWishReply(bodyId: string, wish: string) {
  const body = celestialBodies.find((item) => item.id === bodyId) ?? celestialBodies[0];
  const trimmedWish = wish.trim();

  if (unsafePattern.test(trimmedWish)) {
    return `${body.name}把光放低一点：这个愿望里可能包含伤害、危险或不适合扩散的内容。我不能帮你强化它，但愿意陪你把它改写成更安全的版本，比如“希望今晚先照顾好自己，并向可信的人求助”。`;
  }

  if (offTopicPattern.test(trimmedWish)) {
    return `${body.name}轻轻摇了摇星光：这个愿望超出了星空陪伴和天文学习的范围。我可以把它转成一个更适合这里的方向——愿你像观察夜空一样，慢慢找到清晰、可靠、不会伤害自己的下一步。`;
  }

  if (personalInfoPattern.test(trimmedWish)) {
    return `${body.name}把愿望卡轻轻合上：愿望里好像有真实联系方式、学校或地址一类的信息。为了保护你，请把这些内容删掉，再写成“希望我今天完成一个小目标”这样的安全愿望。`;
  }

  return `${body.avatar} ${body.name}收到了你的愿望：“${trimmedWish}”。我会用${body.tone}的方式提醒你：愿望不是魔法保证，而是一颗可以被你每天靠近的小星点。今晚先做一件很小的事，把它变成真实轨道吧。`;
}

function loadWishes() {
  try {
    const saved = window.localStorage.getItem(wishStorageKey);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved) as WishRecord[];
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.id === "string" && typeof item.wish === "string")
      : [];
  } catch {
    return [];
  }
}

function wrapCanvasText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let currentLine = "";

  for (const character of text) {
    const nextLine = `${currentLine}${character}`;

    if (context.measureText(nextLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = character;
    } else {
      currentLine = nextLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.92);
  });
}

async function createWishCardImage(record: WishRecord, body: (typeof celestialBodies)[number]) {
  const canvas = document.createElement("canvas");
  const scale = 2;
  const width = 720;
  const height = 960;
  canvas.width = width * scale;
  canvas.height = height * scale;

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.scale(scale, scale);
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0f2f5f");
  gradient.addColorStop(0.56, "#10172f");
  gradient.addColorStop(1, "#2e1454");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(255, 255, 255, 0.75)";
  for (let index = 0; index < 64; index += 1) {
    const x = (index * 89) % width;
    const y = (index * 137) % height;
    const radius = index % 5 === 0 ? 2 : 1;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = "rgba(255, 255, 255, 0.08)";
  context.roundRect(48, 56, width - 96, height - 112, 36);
  context.fill();
  context.strokeStyle = "rgba(186, 230, 253, 0.28)";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#bae6fd";
  context.font = "26px Arial, sans-serif";
  context.fillText("假设星星会说话｜星空愿望卡", 84, 112);

  context.fillStyle = "#ffffff";
  context.font = "72px Arial, sans-serif";
  context.fillText(body.avatar, 84, 210);

  context.font = "42px Arial, sans-serif";
  context.fillText(`${body.name}的回应`, 174, 178);

  context.fillStyle = "#cbd5e1";
  context.font = "24px Arial, sans-serif";
  context.fillText(body.tagline.slice(0, 24), 174, 220);

  context.fillStyle = "rgba(255, 255, 255, 0.12)";
  context.roundRect(84, 284, width - 168, 150, 26);
  context.fill();
  context.fillStyle = "#e0f2fe";
  context.font = "24px Arial, sans-serif";
  context.fillText("我的愿望", 116, 328);
  context.fillStyle = "#ffffff";
  context.font = "30px Arial, sans-serif";
  wrapCanvasText(context, record.wish, width - 232).slice(0, 3).forEach((line, index) => {
    context.fillText(line, 116, 374 + index * 42);
  });

  context.fillStyle = "#bae6fd";
  context.font = "24px Arial, sans-serif";
  context.fillText("星星回应", 84, 506);
  context.fillStyle = "#f8fafc";
  context.font = "28px Arial, sans-serif";
  wrapCanvasText(context, record.reply, width - 168).slice(0, 9).forEach((line, index) => {
    context.fillText(line, 84, 554 + index * 42);
  });

  context.fillStyle = "rgba(255, 255, 255, 0.72)";
  context.font = "22px Arial, sans-serif";
  context.fillText("保存这张卡，记得把愿望变成一件很小的行动。", 84, 882);

  return canvasToBlob(canvas);
}

function buildShareText(record: WishRecord, body: (typeof celestialBodies)[number]) {
  return `假设星星会说话｜${body.name}的愿望卡\n\n我的愿望：${record.wish}\n\n星星回应：${record.reply}`;
}

export function StarWishExperience() {
  const featuredBodies = useMemo(() => celestialBodies.filter((body) => body.featured).slice(0, 6), []);
  const [selectedBodyId, setSelectedBodyId] = useState(featuredBodies[0]?.id ?? "sun");
  const [wish, setWish] = useState("");
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [copiedWishId, setCopiedWishId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [isPreparingShare, setIsPreparingShare] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

  const selectedBody = celestialBodies.find((body) => body.id === selectedBodyId) ?? celestialBodies[0];
  const latestWish = wishes[0];
  const latestWishBody = latestWish
    ? celestialBodies.find((body) => body.id === latestWish.bodyId) ?? selectedBody
    : selectedBody;

  useEffect(() => {
    setWishes(loadWishes());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(wishStorageKey, JSON.stringify(wishes.slice(0, 12)));
    } catch {
      // Ignore local storage failures and keep the child experience usable.
    }
  }, [hasHydrated, wishes]);

  useEffect(() => {
    return () => {
      if (shareImageUrl) {
        URL.revokeObjectURL(shareImageUrl);
      }
    };
  }, [shareImageUrl]);

  function submitWish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedWish = wish.trim();

    if (!trimmedWish) {
      return;
    }

    if (unsafePattern.test(trimmedWish)) {
      setToast("这个愿望可能会让人受伤。请把它改成安全、温柔的版本再生成。");
      return;
    }

    if (personalInfoPattern.test(trimmedWish)) {
      setToast("愿望里不要写电话、地址、学校、邮箱等真实信息。删掉后再试一次。");
      return;
    }

    if (offTopicPattern.test(trimmedWish)) {
      setToast("这里更适合写和成长、宇宙、陪伴有关的小愿望。换一个更温柔的愿望吧。");
      return;
    }

    const nextWish: WishRecord = {
      id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      bodyId: selectedBody.id,
      wish: trimmedWish,
      reply: createWishReply(selectedBody.id, trimmedWish),
      createdAt: new Date().toISOString(),
    };

    setWishes((current) => [nextWish, ...current].slice(0, 12));
    setWish("");
    setCopiedWishId(null);
    setShareImageUrl(null);
    setToast("愿望卡已生成，适合截图保存。");
  }

  async function copyWishCard(record: WishRecord) {
    const body = celestialBodies.find((item) => item.id === record.bodyId) ?? selectedBody;
    const shareText = buildShareText(record, body);

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedWishId(record.id);
      setToast("愿望卡文字已复制。");
    } catch {
      setCopiedWishId(null);
      setToast("复制失败，可以直接截图保存愿望卡。");
    }
  }

  async function prepareShareImage(record: WishRecord) {
    const body = celestialBodies.find((item) => item.id === record.bodyId) ?? selectedBody;
    setIsPreparingShare(true);

    try {
      const blob = await createWishCardImage(record, body);

      if (!blob) {
        setToast("生成图片失败，可以先复制文字分享。");
        return null;
      }

      const imageUrl = URL.createObjectURL(blob);
      setShareImageUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }

        return imageUrl;
      });
      setToast("愿望卡图片已生成。");
      return { blob, imageUrl };
    } finally {
      setIsPreparingShare(false);
    }
  }

  async function shareWishCard(record: WishRecord) {
    const body = celestialBodies.find((item) => item.id === record.bodyId) ?? selectedBody;
    const shareText = buildShareText(record, body);
    const generated = await prepareShareImage(record);

    if (!generated) {
      await copyWishCard(record);
      return;
    }

    const file = new File([generated.blob], `${body.id}-wish-card.png`, { type: "image/png" });

    try {
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({
          title: `${body.name}的星空愿望卡`,
          text: shareText,
          files: [file],
        });
        setToast("已打开系统分享面板。");
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: `${body.name}的星空愿望卡`,
          text: shareText,
          url: window.location.href,
        });
        setToast("已打开系统分享面板。");
        return;
      }

      await navigator.clipboard.writeText(`${shareText}\n\n体验链接：${window.location.href}`);
      setCopiedWishId(record.id);
      setToast("当前浏览器不支持系统分享，已复制文字和链接。");
    } catch {
      await copyWishCard(record);
    }
  }

  function downloadShareImage(record: WishRecord) {
    void (async () => {
      const generated = shareImageUrl ? { imageUrl: shareImageUrl } : await prepareShareImage(record);

      if (!generated || !downloadLinkRef.current) {
        return;
      }

      downloadLinkRef.current.href = generated.imageUrl;
      downloadLinkRef.current.download = "stars-saying-wish-card.png";
      downloadLinkRef.current.click();
      setToast("愿望卡图片已准备下载。");
    })();
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div key={toast} className="subtle-toast rounded-2xl border border-sky-200/10 bg-sky-300/15 px-4 py-3 text-sm text-sky-50">
          {toast}
        </div>
      ) : null}
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/25 p-5">
        <p className="text-sm text-sky-200">选择回应你的星体</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {featuredBodies.map((body) => {
            const isActive = body.id === selectedBody.id;

            return (
              <button
                key={body.id}
                type="button"
                onClick={() => setSelectedBodyId(body.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-sky-200 bg-sky-300 text-slate-950 active-celestial-glow"
                    : "border-white/10 bg-white/5 text-slate-100"
                }`}
              >
                <span className="text-2xl breathing-avatar">{body.avatar}</span>
                <span className="mt-2 block text-sm font-medium">{body.name}</span>
                <span className="mt-1 block text-xs opacity-75">{body.type}</span>
              </button>
            );
          })}
        </div>
      </section>

      <form onSubmit={submitWish} className="rounded-[2rem] border border-sky-200/10 bg-sky-300/10 p-5">
        <p className="text-sm text-sky-200">写下一个安全、温柔、适合分享的愿望</p>
        <textarea
          value={wish}
          onChange={(event) => setWish(event.target.value)}
          maxLength={120}
          rows={5}
          placeholder={`对${selectedBody.name}说：希望我能……`}
          className="mt-4 w-full rounded-3xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-slate-500"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs leading-5 text-sky-100/80">不要写真实姓名、电话、学校或地址。愿望会保存在当前设备，最多保留 12 张卡片。</p>
          <button type="submit" className="rounded-2xl bg-sky-300 px-5 py-3 text-sm font-medium text-slate-950">
            生成愿望卡
          </button>
        </div>
      </form>

      {latestWish ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur">
          <p className="text-sm text-sky-200">最新愿望卡</p>
          <div className="mt-4 rounded-[1.75rem] border border-sky-200/10 bg-gradient-to-br from-sky-300/20 to-fuchsia-300/10 p-5">
            <div className="flex items-center gap-3">
              <span className="text-4xl breathing-avatar">{latestWishBody.avatar}</span>
              <div>
                <h2 className="text-xl font-semibold text-white">{latestWishBody.name}的回应</h2>
                <p className="text-xs text-sky-100/80">适合截图保存或复制分享</p>
              </div>
            </div>
            <p className="mt-5 rounded-2xl bg-white/10 px-4 py-3 text-sm leading-7 text-white">{latestWish.wish}</p>
            <p className="mt-3 text-sm leading-7 text-sky-50">{latestWish.reply}</p>
          </div>
          <div className="mt-4 grid gap-3">
            <button
              type="button"
              onClick={() => void shareWishCard(latestWish)}
              disabled={isPreparingShare}
              className="w-full rounded-2xl bg-sky-300 px-4 py-3 text-sm font-medium text-slate-950 disabled:opacity-60"
            >
              {isPreparingShare ? "正在生成分享卡……" : "用手机系统分享"}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void copyWishCard(latestWish)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              >
                {copiedWishId === latestWish.id ? "已复制文字" : "复制文字和链接"}
              </button>
              <button
                type="button"
                onClick={() => downloadShareImage(latestWish)}
                disabled={isPreparingShare}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white disabled:opacity-60"
              >
                下载图片
              </button>
            </div>
            <a
              href="/wish-wall"
              className="rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-center text-sm text-emerald-50"
            >
              把愿望放到愿望墙看看
            </a>
            <a ref={downloadLinkRef} className="hidden" aria-hidden="true" />
            {shareImageUrl ? (
              <a href={shareImageUrl} target="_blank" rel="noreferrer" className="text-center text-xs text-sky-200 underline">
                打开已生成图片预览
              </a>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="rounded-[1.75rem] border border-dashed border-white/10 bg-slate-950/20 p-6 text-sm leading-7 text-slate-300">
          {hasHydrated ? "还没有愿望卡。写下一个愿望后，星星会给你一段安全、温柔、可分享的回应。" : "正在恢复你的愿望卡……"}
        </section>
      )}

      {wishes.length > 1 ? (
        <section className="rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5">
          <p className="text-sm text-sky-200">最近愿望</p>
          <div className="mt-4 space-y-3">
            {wishes.slice(1, 5).map((record) => {
              const body = celestialBodies.find((item) => item.id === record.bodyId) ?? selectedBody;

              return (
                <article key={record.id} className="rounded-2xl bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200">
                  <p className="text-sky-200">{body.avatar} {body.name}</p>
                  <p className="mt-1">{record.wish}</p>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
