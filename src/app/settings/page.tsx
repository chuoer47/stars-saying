import { redirect } from "next/navigation";

import { lockSettings } from "@/app/settings/actions";
import { SettingsLoginForm } from "@/components/settings-login-form";
import { competitionPoints, internalRouteCards } from "@/data/internal-pages";
import { getSettingsConfigSummary } from "@/lib/model-config";
import { isSettingsUnlocked } from "@/lib/settings-auth";

interface SettingsPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [unlocked, resolvedSearchParams] = await Promise.all([isSettingsUnlocked(), searchParams]);

  if (!unlocked) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-12">
        <section className="w-full rounded-[2rem] border border-white/10 bg-slate-950/35 p-6 backdrop-blur">
          <a href="/" className="text-sm text-sky-200">
            ← 返回儿童首页
          </a>
          <p className="mt-5 text-sm text-amber-100">成人设置入口</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">输入密码后查看设置</h1>
          <p className="mt-3 text-sm leading-7 text-slate-200/90">
            这里包含竞赛说明、模型配置状态和内部功能入口，不展示在儿童主流程中。
          </p>
          <SettingsLoginForm hasError={resolvedSearchParams?.error === "1"} />
        </section>
      </main>
    );
  }

  const config = getSettingsConfigSummary();

  async function logout() {
    "use server";
    await lockSettings();
    redirect("/settings");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <div className="flex items-center justify-between gap-3">
        <a href="/" className="text-sm text-sky-200">
          ← 返回儿童首页
        </a>
        <form action={logout}>
          <button type="submit" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
            锁定设置
          </button>
        </form>
      </div>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <p className="text-sm text-amber-100">设置中心</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">竞赛说明与系统配置</h1>
        <p className="mt-3 text-sm leading-7 text-slate-200/90">
          这个页面面向老师、家长或开发者，用于查看项目说明、模型配置状态和内部扩展入口。
        </p>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-amber-200/20 bg-amber-200/10 p-5">
        <p className="text-sm text-amber-100">之前竞赛说明</p>
        <h2 className="mt-2 text-xl font-semibold text-white">假设星星会说话</h2>
        <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
          {competitionPoints.map((point, index) => (
            <article key={point} className="min-w-[84%] snap-start rounded-3xl bg-white/10 p-4 text-sm leading-7 text-amber-50">
              <p className="text-amber-100">亮点 {index + 1}</p>
              <p className="mt-2">{point}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-sky-200/10 bg-sky-300/10 p-5">
        <p className="text-sm text-sky-200">模型与密钥配置</p>
        <div className="mt-4 grid gap-3 text-sm leading-6">
          {[
            ["供应商", config.provider],
            ["聊天模型", config.chatModel],
            ["Base URL", config.baseURL],
            ["API Key", config.apiKey],
            ["Embedding", config.embeddingModel],
            ["Vision", config.visionModel],
            ["Rerank", config.rerankModel],
            ["设置密码", config.settingsPassword],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
              <p className="text-sky-100">{label}</p>
              <p className="mt-1 break-words text-white">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-sky-50/75">
          页面只显示脱敏或状态信息，不输出完整密钥。实际模型调用仍在服务端读取 `.env`。
        </p>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5">
        <p className="text-sm text-sky-200">内部入口</p>
        <div className="mt-4 grid gap-3">
          {internalRouteCards.map((route) => (
            <a key={route.href} href={route.href} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <span className="text-base font-semibold text-white">{route.title}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-300">{route.body}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
