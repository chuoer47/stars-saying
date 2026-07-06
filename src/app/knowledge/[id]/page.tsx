import { notFound } from "next/navigation";

import { OfficialKnowledgePanel } from "@/components/official-knowledge-panel";
import { PageHeader } from "@/components/page-header";
import { celestialBodies } from "@/data/celestial-bodies";
import { classroomModules } from "@/data/classroom-modules";
import { knowledgeCards } from "@/data/knowledge-cards";

interface KnowledgePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function KnowledgePage({ params }: KnowledgePageProps) {
  const { id } = await params;
  const body = celestialBodies.find((item) => item.id === id);

  if (!body) {
    notFound();
  }

  const card = knowledgeCards[body.id];

  if (!card) {
    notFound();
  }

  const relatedModules = classroomModules.filter((module) => module.relatedBodyIds.includes(body.id));

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-24 pt-8">
      <PageHeader
        label="知识卡片"
        title={body.name}
        description={card.summary}
        backHref={`/chat/${body.id}`}
        accent="sky"
      >
        <div className="flex flex-wrap gap-2">
          {body.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-sky-200/10 bg-sky-300/10 px-3 py-1 text-xs text-sky-100">
              {tag}
            </span>
          ))}
        </div>
      </PageHeader>

      <section className="mt-5 space-y-4">
        <OfficialKnowledgePanel bodyId={body.id} bodyName={body.name} />

        <section className="rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-sky-200">滑动知识卡</p>
              <h2 className="mt-1 text-lg font-semibold text-white">一次只看一小块</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              左右滑动
            </span>
          </div>

          <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
            <article className="min-w-[86%] snap-start rounded-3xl bg-sky-300/10 p-4 text-sm leading-7 text-sky-50">
              <p className="text-sky-200">基础参数</p>
              <dl className="mt-3 space-y-3">
                {card.keyFacts.map((fact) => (
                  <div key={fact.label} className="rounded-2xl bg-white/8 px-4 py-3">
                    <dt className="text-sky-100">{fact.label}</dt>
                    <dd className="mt-1 text-white">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </article>

            <article className="min-w-[86%] snap-start rounded-3xl bg-emerald-300/10 p-4 text-sm leading-7 text-emerald-50">
              <p className="text-emerald-100">主要特征</p>
              <ul className="mt-3 space-y-3">
                {card.features.map((feature) => (
                  <li key={feature} className="rounded-2xl bg-white/8 px-4 py-3">
                    {feature}
                  </li>
                ))}
              </ul>
            </article>

            <article className="min-w-[86%] snap-start rounded-3xl bg-amber-300/10 p-4 text-sm leading-7 text-amber-50">
              <p className="text-amber-100">常见误区</p>
              <p className="mt-3 rounded-2xl bg-white/8 px-4 py-3">{card.misconception}</p>
            </article>

            <article className="min-w-[86%] snap-start rounded-3xl bg-fuchsia-300/10 p-4 text-sm leading-7 text-fuchsia-50">
              <p className="text-fuchsia-100">文化与科学边界</p>
              <p className="mt-3 rounded-2xl bg-white/8 px-4 py-3">{card.culture}</p>
              <p className="mt-3 text-fuchsia-50/85">
                有些星星名字来自故事，但科学事实要靠观察和证据。
              </p>
            </article>
          </div>
        </section>

        {relatedModules.length > 0 ? (
          <article className="rounded-[1.75rem] border border-sky-200/10 bg-sky-300/10 p-5 text-sm leading-7 text-sky-50">
            <h2 className="text-lg font-semibold text-white">相关星空课堂</h2>
            <div className="mt-4 space-y-3">
              {relatedModules.map((module) => (
                <a key={module.id} href={`/classroom/${module.id}`} className="block rounded-2xl bg-white/8 px-4 py-3">
                  <span className="text-base font-medium text-white">{module.icon} {module.title}</span>
                  <span className="mt-1 block text-xs text-sky-100/90">{module.subtitle}</span>
                </a>
              ))}
            </div>
          </article>
        ) : null}

        <details className="rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5 text-sm leading-7 text-slate-200">
          <summary className="cursor-pointer text-lg font-semibold text-white">推荐提问和冷知识</summary>
          <ul className="mt-4 space-y-3">
            {body.suggestedQuestions.map((question) => (
              <li key={question} className="rounded-2xl bg-white/5 px-4 py-3">
                {question}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-2xl bg-amber-200/10 px-4 py-3 text-amber-50">{card.funFact}</p>
        </details>

        <details className="rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5 text-sm leading-7 text-slate-200">
          <summary className="cursor-pointer text-lg font-semibold text-white">参考来源</summary>
          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400">
            这些来源帮助我们核对基础事实与科学解释。
          </p>
          <ul className="mt-4 space-y-2">
            {card.sources.map((source) => (
              <li key={source} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-white">{source}</p>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5">
        <p className="text-sm text-sky-200">下一步</p>
        <p className="mt-2 text-sm leading-7 text-slate-200/90">
          想继续提问时，可以返回对话页；如果想快速换一颗星，也可以直接回到星体选择页面。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`/chat/${body.id}`} className="rounded-2xl bg-sky-300 px-4 py-3 text-sm font-medium text-slate-950">
            回到对话页
          </a>
          <a href="/chat" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            重新选星
          </a>
        </div>
      </section>
    </main>
  );
}
