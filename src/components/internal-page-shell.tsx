import { internalRouteCards, type InternalPageKey, internalPages } from "@/data/internal-pages";
import { requireSettingsAccess } from "@/lib/settings-auth";

interface InternalPageShellProps {
  pageKey: InternalPageKey;
}

export async function InternalPageShell({ pageKey }: InternalPageShellProps) {
  await requireSettingsAccess();

  const page = internalPages[pageKey];

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <div className="flex items-center justify-between gap-3">
        <a href="/admin" className="text-sm text-sky-200">
          ← 返回设置
        </a>
        <a href="/" className="text-sm text-slate-300">
          儿童首页
        </a>
      </div>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <p className="text-sm text-amber-100">{page.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{page.title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-200/90">{page.description}</p>
      </section>

      <section className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2">
        {page.sections.map((section) => (
          <article
            key={section.title}
            className="min-w-[86%] snap-start rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5"
          >
            <p className="text-sm text-sky-200">{section.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{section.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {section.items.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-white">
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-sky-200/10 bg-sky-300/10 p-5">
        <p className="text-sm text-sky-200">内部入口</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {internalRouteCards.map((route) => (
            <a
              key={route.href}
              href={route.href}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            >
              {route.title}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
