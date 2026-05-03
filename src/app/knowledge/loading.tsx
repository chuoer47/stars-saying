export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-12">
      <section className="w-full rounded-[2rem] border border-white/10 bg-slate-950/25 p-6 text-center backdrop-blur">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full border border-sky-200/20 bg-sky-300/20" />
        <p className="mt-4 text-sm text-sky-200">知识卡片正在整理</p>
        <p className="mt-2 text-sm leading-7 text-slate-300">正在读取这颗星体的结构化内容和来源……</p>
      </section>
    </main>
  );
}
