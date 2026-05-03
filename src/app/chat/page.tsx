import { CelestialSelection, type SelectionFilter } from "@/components/celestial-selection";
import { celestialBodies } from "@/data/celestial-bodies";
import type { CelestialCategory } from "@/types/celestial";

interface ChatPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

const validCategories = new Set<SelectionFilter>([
  "all",
  "featured",
  "solar-system",
  "minor-body",
  "star",
  "constellation",
  "deep-space",
  "exoplanet",
]);

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedCategory = resolvedSearchParams?.category;
  const activeCategory = validCategories.has(requestedCategory as SelectionFilter)
    ? (requestedCategory as SelectionFilter)
    : "all";

  const bodies =
    activeCategory === "all"
      ? celestialBodies
      : activeCategory === "featured"
        ? celestialBodies.filter((body) => body.featured)
        : celestialBodies.filter((body) => body.category === (activeCategory as CelestialCategory));

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <a href="/" className="text-sm text-sky-200">
        ← 返回首页
      </a>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <p className="text-sm text-sky-200">选择星星朋友</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">今晚，你想和哪颗星星说话？</h1>
        <p className="mt-3 text-sm leading-7 text-slate-200/90">
          先挑一个最想认识的星体，再去问它一个好奇的问题。你也可以收藏喜欢的星星，下次继续聊。
        </p>
      </section>

      <section className="mt-5 rounded-[2rem] border border-white/10 bg-slate-950/20 p-4">
        <CelestialSelection bodies={bodies} activeCategory={activeCategory} />
      </section>
    </main>
  );
}
