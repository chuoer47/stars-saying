import { ExploreExperience } from "@/components/explore-experience";
import { PageHeader } from "@/components/page-header";

export default function ExplorePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-24 pt-8">
      <PageHeader
        label="星体探索器"
        title="随机抽一颗宇宙朋友"
        description="认识新的宇宙朋友，了解它的故事和性格，自动存进你的星星收藏。"
        accent="amber"
      >
        <a href="/memory" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
          打开记忆库
        </a>
        <a href="/library" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
          看星空图鉴
        </a>
      </PageHeader>

      <section className="mt-5">
        <ExploreExperience />
      </section>
    </main>
  );
}
