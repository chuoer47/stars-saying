import type { ReactNode } from "react";

interface PageHeaderProps {
  label: string;
  title: string;
  description: string;
  backHref?: string;
  accent?: "sky" | "amber" | "emerald" | "fuchsia";
  children?: ReactNode;
}

const accentStyles: Record<string, string> = {
  sky: "from-sky-300/20 to-transparent",
  amber: "from-amber-300/20 to-transparent",
  emerald: "from-emerald-300/20 to-transparent",
  fuchsia: "from-fuchsia-300/20 to-transparent",
};

const accentLabelColors: Record<string, string> = {
  sky: "text-sky-200",
  amber: "text-amber-100",
  emerald: "text-emerald-100",
  fuchsia: "text-fuchsia-100",
};

export function PageHeader({
  label,
  title,
  description,
  backHref = "/",
  accent = "sky",
  children,
}: PageHeaderProps) {
  return (
    <section
      className={`relative mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accentStyles[accent]} pointer-events-none`}
      />
      <div className="relative">
        <a href={backHref} className="inline-block text-sm text-sky-200 hover:text-sky-100">
          ← 返回
        </a>
        <p className={`mt-3 text-sm ${accentLabelColors[accent]}`}>{label}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-200/90">{description}</p>
        {children ? <div className="mt-4 flex flex-wrap gap-2">{children}</div> : null}
      </div>
    </section>
  );
}