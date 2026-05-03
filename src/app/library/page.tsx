import { KnowledgeLibraryExplorer } from "@/components/knowledge-library-explorer";

export default function LibraryPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <a href="/" className="text-sm text-sky-200">
        ← 返回首页
      </a>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <p className="text-sm text-sky-200">星空图鉴</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">想查哪颗星？</h1>
        <p className="mt-3 text-sm leading-7 text-slate-200/90">
          这里可以搜索星体、星云、星系和观星小概念。找到喜欢的内容后，可以继续去聊天或看知识卡片。
        </p>
      </section>

      <section className="mt-5 rounded-[2rem] border border-white/10 bg-slate-950/20 p-4">
        <KnowledgeLibraryExplorer />
      </section>
    </main>
  );
}
