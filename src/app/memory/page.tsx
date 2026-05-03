import { MemoryExperience } from "@/components/memory-experience";

export default function MemoryPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <a href="/" className="text-sm text-sky-200">
        ← 返回首页
      </a>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <p className="text-sm text-sky-200">星体记忆库</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">把认识过的星星收好</h1>
        <p className="mt-3 text-sm leading-7 text-slate-200/90">
          这里保存随机探索过的星体、科普说明和专属性格。孩子可以横向滑动浏览，也可以点按钮听星体说话。
        </p>
        <a href="/explore" className="mt-4 inline-flex rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950">
          继续随机抽星
        </a>
      </section>

      <section className="mt-5">
        <MemoryExperience />
      </section>
    </main>
  );
}
