"use client";

import { useEffect, useMemo, useState } from "react";

import type { ClassroomModule } from "@/data/classroom-modules";

type LearningFilter = "all" | "todo" | "done";

interface ClassroomModuleListProps {
  modules: ClassroomModule[];
}

const progressStorageKey = "stars-saying-classroom-progress";

function loadCompletedModules() {
  try {
    const saved = window.localStorage.getItem(progressStorageKey);
    const parsed = saved ? (JSON.parse(saved) as string[]) : [];

    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function ClassroomModuleList({ modules }: ClassroomModuleListProps) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<LearningFilter>("all");

  useEffect(() => {
    setCompletedIds(loadCompletedModules());
  }, []);

  const filteredModules = useMemo(
    () =>
      modules.filter((module) => {
        const isCompleted = completedIds.includes(module.id);

        if (filter === "done") {
          return isCompleted;
        }

        if (filter === "todo") {
          return !isCompleted;
        }

        return true;
      }),
    [completedIds, filter, modules],
  );

  const doneCount = modules.filter((module) => completedIds.includes(module.id)).length;

  return (
    <div className="space-y-4">
      <section className="rounded-[1.75rem] border border-emerald-200/20 bg-emerald-200/10 p-5 text-sm leading-7 text-emerald-50">
        <p className="text-sm text-emerald-100">学习记录</p>
        <p className="mt-2">
          已学 {doneCount}/{modules.length} 节。本记录只保存在当前设备里。
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["all", "全部"],
            ["todo", "未学"],
            ["done", "已学"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value as LearningFilter)}
              className={`rounded-2xl border px-3 py-2 text-sm ${
                filter === value
                  ? "border-emerald-100 bg-emerald-200 text-slate-950"
                  : "border-white/10 bg-white/5 text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        {filteredModules.map((module) => {
          const isCompleted = completedIds.includes(module.id);

          return (
            <article key={module.id} className="rounded-[1.75rem] border border-white/10 bg-slate-950/25 p-5 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                  {module.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2 text-xs text-sky-100">
                    <span className="rounded-full border border-sky-200/10 bg-sky-300/10 px-3 py-1">{module.duration}</span>
                    <span className="rounded-full border border-sky-200/10 bg-sky-300/10 px-3 py-1">{module.level}</span>
                    <span className={`rounded-full border px-3 py-1 ${
                      isCompleted
                        ? "border-emerald-200/20 bg-emerald-200/15 text-emerald-50"
                        : "border-amber-200/20 bg-amber-200/15 text-amber-50"
                    }`}>
                      {isCompleted ? "已学" : "未学"}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-white">{module.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{module.subtitle}</p>
                </div>
              </div>

              <details className="mt-4 rounded-2xl bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200">
                <summary className="cursor-pointer text-white">看看这节课会学什么</summary>
                <p className="mt-3">{module.goal}</p>
              </details>

              <a
                href={`/classroom/${module.id}`}
                className="mt-4 block rounded-2xl bg-sky-300 px-4 py-3 text-center text-sm font-medium text-slate-950"
              >
                {isCompleted ? "复习这节课" : "开始这节课"}
              </a>
            </article>
          );
        })}
      </section>

      {filteredModules.length === 0 ? (
        <section className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-200">
          这一组暂时没有课程，换一个筛选看看。
        </section>
      ) : null}
    </div>
  );
}
