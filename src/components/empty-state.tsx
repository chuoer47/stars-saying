import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon = "🌟",
  title,
  description,
  actionLabel,
  actionHref,
  children,
}: EmptyStateProps) {
  return (
    <section className="rounded-[2rem] border border-dashed border-white/15 bg-white/8 p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
        {icon}
      </div>
      <p className="mt-4 text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-200">{description}</p>
      {actionLabel && actionHref ? (
        <a
          href={actionHref}
          className="mt-5 inline-flex rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950"
        >
          {actionLabel}
        </a>
      ) : null}
      {children}
    </section>
  );
}