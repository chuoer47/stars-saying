import { notFound } from "next/navigation";

import { LearningProgressButton } from "@/components/learning-progress-button";
import { celestialBodies } from "@/data/celestial-bodies";
import { classroomModules, getClassroomModule } from "@/data/classroom-modules";

interface ClassroomModulePageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return classroomModules.map((classroomModule) => ({ id: classroomModule.id }));
}

export default async function ClassroomModulePage({ params }: ClassroomModulePageProps) {
  const { id } = await params;
  const classroomModule = getClassroomModule(id);

  if (!classroomModule) {
    notFound();
  }

  const relatedBodies = classroomModule.relatedBodyIds
    .map((id) => celestialBodies.find((body) => body.id === id))
    .filter(Boolean);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <a href="/classroom" className="text-sm text-sky-200">
        ← 返回星空课堂
      </a>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-4xl">
            {classroomModule.icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-sky-200">星空课堂 / Learning module</p>
            <h1 className="mt-1 text-3xl font-semibold text-white">{classroomModule.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-200/90">{classroomModule.subtitle}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs text-sky-100">
          <span className="rounded-full border border-sky-200/10 bg-sky-300/10 px-3 py-1">{classroomModule.duration}</span>
          <span className="rounded-full border border-sky-200/10 bg-sky-300/10 px-3 py-1">{classroomModule.level}</span>
        </div>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-sky-200">滑动上课</p>
            <h2 className="mt-1 text-lg font-semibold text-white">一张卡学一步</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            左右滑动
          </span>
        </div>

        <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
          <article className="min-w-[86%] snap-start rounded-3xl bg-sky-300/10 p-5 text-sm leading-7 text-sky-50">
            <p className="text-sky-200">学习目标</p>
            <p className="mt-3">{classroomModule.goal}</p>
          </article>

          <article className="min-w-[86%] snap-start rounded-3xl bg-emerald-300/10 p-5">
            <p className="text-sm text-emerald-100">关键概念</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-emerald-50">
              {classroomModule.keyIdeas.map((idea) => (
                <li key={idea} className="rounded-2xl bg-white/8 px-4 py-3">
                  {idea}
                </li>
              ))}
            </ul>
          </article>

          <article className="min-w-[86%] snap-start rounded-3xl bg-amber-300/10 p-5">
            <p className="text-sm text-amber-100">课堂小任务</p>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-amber-50">
              {classroomModule.activities.map((activity, index) => (
                <li key={activity} className="rounded-2xl bg-white/8 px-4 py-3">
                  <span className="text-amber-200">{index + 1}. </span>
                  {activity}
                </li>
              ))}
            </ol>
          </article>

          <article className="min-w-[86%] snap-start rounded-3xl bg-fuchsia-300/10 p-5 text-sm leading-7 text-fuchsia-50">
            <p className="text-fuchsia-100">传说感 vs 科学事实</p>
            <p className="mt-4 rounded-2xl bg-white/8 px-4 py-3">
              <span className="text-fuchsia-100">容易误会：</span>
              {classroomModule.mythVsFact.myth}
            </p>
            <p className="mt-3 rounded-2xl bg-white/8 px-4 py-3">
              <span className="text-fuchsia-100">科学解释：</span>
              {classroomModule.mythVsFact.fact}
            </p>
          </article>

          <article className="min-w-[86%] snap-start rounded-3xl bg-white/8 p-5 text-sm leading-7 text-slate-200">
            <p className="text-sky-200">复盘问题</p>
            <p className="mt-3">{classroomModule.reviewPrompt}</p>
            <LearningProgressButton moduleId={classroomModule.id} />
          </article>
        </div>
      </section>

      <details className="mt-5 rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5">
        <summary className="cursor-pointer text-sm text-sky-200">关联星体</summary>
        <div className="mt-4 grid gap-3">
          {relatedBodies.map((body) =>
            body ? (
              <a
                key={body.id}
                href={`/knowledge/${body.id}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="flex items-center gap-3 text-sm text-white">
                  <span className="text-2xl">{body.avatar}</span>
                  <span>{body.name}</span>
                </span>
                <span className="text-xs text-sky-200">看知识卡片</span>
              </a>
            ) : null,
          )}
        </div>
      </details>
    </main>
  );
}
