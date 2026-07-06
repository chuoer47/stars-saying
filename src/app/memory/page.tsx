import { MemoryExperience } from "@/components/memory-experience";
import { PageHeader } from "@/components/page-header";

export default function MemoryPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-24 pt-8">
      <PageHeader
        label="星体记忆库"
        title="把认识过的星星收好"
        description="这里保存随机探索过的星体、科普说明和专属性格。孩子可以横向滑动浏览，也可以点按钮听星体说话。"
        accent="amber"
      >
        <a href="/explore" className="inline-flex rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950">
          继续随机抽星
        </a>
      </PageHeader>

      <section className="mt-5">
        <MemoryExperience />
      </section>
    </main>
  );
}
