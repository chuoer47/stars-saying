import { CelestialSelection, type SelectionFilter } from "@/components/celestial-selection";
import { celestialBodies } from "@/data/celestial-bodies";
import { PageHeader } from "@/components/page-header";
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
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-24 pt-8">
      <PageHeader
        label="选择星星朋友"
        title="今晚，你想和哪颗星星说话？"
        description="先挑一个最想认识的星体，再去问它一个好奇的问题。你也可以收藏喜欢的星星，下次继续聊。"
      />

      <section className="mt-5 rounded-[2rem] border border-white/10 bg-slate-950/20 p-4">
        <CelestialSelection bodies={bodies} activeCategory={activeCategory} />
      </section>
    </main>
  );
}
