import { KnowledgeLibraryExplorer } from "@/components/knowledge-library-explorer";
import { PageHeader } from "@/components/page-header";

export default function LibraryPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-24 pt-8">
      <PageHeader
        label="星空图鉴"
        title="想查哪颗星？"
        description="这里可以搜索星体、星云、星系和观星小概念。找到喜欢的内容后，可以继续去聊天或看知识卡片。"
        accent="fuchsia"
      />

      <section className="mt-5 rounded-[2rem] border border-white/10 bg-slate-950/20 p-4">
        <KnowledgeLibraryExplorer />
      </section>
    </main>
  );
}
