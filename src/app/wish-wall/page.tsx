import { WishWallExperience } from "@/components/wish-wall-experience";

export default function WishWallPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <a href="/" className="text-sm text-sky-200">
        ← 返回首页
      </a>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <p className="text-sm text-sky-200">愿望墙</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">把愿望星星挂起来</h1>
        <p className="mt-3 text-sm leading-7 text-slate-200/90">
          这里会展示这台设备里安全的愿望卡。它适合在家里、课堂或小组活动里分享给身边的人看。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="/wish" className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950">
            生成新愿望卡
          </a>
          <a href="/chat" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            找星星聊天
          </a>
        </div>
      </section>

      <section className="mt-5">
        <WishWallExperience />
      </section>
    </main>
  );
}
