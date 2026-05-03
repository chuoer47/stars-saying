import { MemoryChatExperience } from "@/components/memory-chat-experience";

interface MemoryChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MemoryChatPage({ params }: MemoryChatPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <a href="/chat" className="text-sm text-sky-200">
        ← 返回星星聊天
      </a>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <p className="text-sm text-sky-200">抽到的星星也能聊天</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">和记忆库里的星体说话</h1>
        <p className="mt-3 text-sm leading-7 text-slate-200/90">
          这颗星来自你之前随机抽星收录的本机记忆。它会根据已保存的科普资料和专属性格回答你。
        </p>
      </section>

      <section className="mt-5">
        <MemoryChatExperience entryId={id} />
      </section>
    </main>
  );
}
