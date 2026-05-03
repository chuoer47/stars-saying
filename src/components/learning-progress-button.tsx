"use client";

import { useEffect, useState } from "react";

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

export function getCompletedClassroomModules() {
  if (typeof window === "undefined") {
    return [];
  }

  return loadCompletedModules();
}

interface LearningProgressButtonProps {
  moduleId: string;
}

export function LearningProgressButton({ moduleId }: LearningProgressButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setIsCompleted(loadCompletedModules().includes(moduleId));
  }, [moduleId]);

  function toggleCompleted() {
    const completed = loadCompletedModules();
    const nextCompleted = completed.includes(moduleId)
      ? completed.filter((id) => id !== moduleId)
      : Array.from(new Set([...completed, moduleId]));

    window.localStorage.setItem(progressStorageKey, JSON.stringify(nextCompleted));
    setIsCompleted(nextCompleted.includes(moduleId));
  }

  return (
    <div className="mt-4 rounded-3xl border border-sky-200/10 bg-sky-300/10 p-4">
      <p className="text-sm leading-6 text-sky-50">
        当前状态：{isCompleted ? "已学，会出现在课堂的已学列表里。" : "未学，会留在待学习列表里。"}
      </p>
      <button
        type="button"
        onClick={toggleCompleted}
        className={`mt-3 w-full rounded-2xl px-4 py-3 text-sm font-medium ${
          isCompleted
            ? "border border-white/10 bg-white/10 text-white"
            : "bg-sky-300 text-slate-950"
        }`}
      >
        {isCompleted ? "改回未学" : "标记已学"}
      </button>
    </div>
  );
}
