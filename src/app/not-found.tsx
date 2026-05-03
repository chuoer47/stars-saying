export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-12">
      <section className="w-full rounded-[2rem] border border-white/10 bg-slate-950/25 p-6 text-center backdrop-blur">
        <p className="text-sm text-sky-200">页面没找到</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">这颗星星暂时不在轨道上</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          你访问的内容可能已移动、删除，或者链接里少了一点星光。
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a href="/" className="rounded-2xl bg-sky-300 px-4 py-3 text-sm font-medium text-slate-950">
            返回首页
          </a>
          <a href="/chat?category=featured" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            进入推荐星体
          </a>
        </div>
      </section>
    </main>
  );
}
