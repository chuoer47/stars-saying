"use client";

import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页", emoji: "🏠" },
  { href: "/explore", label: "探索", emoji: "🎲" },
  { href: "/chat", label: "聊天", emoji: "💬" },
  { href: "/library", label: "图鉴", emoji: "📚" },
  { href: "/classroom", label: "课堂", emoji: "📖" },
];

const hiddenPaths = [
  "/admin",
  "/account",
  "/dashboard",
  "/studio",
  "/lab",
  "/exhibition",
  "/intro",
];

export function BottomNav() {
  const pathname = usePathname();

  if (hiddenPaths.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/90 backdrop-blur-xl safe-area-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-xs transition ${
                isActive
                  ? "text-sky-200"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}