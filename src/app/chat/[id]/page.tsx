import { notFound } from "next/navigation";

import { ChatExperience } from "@/components/chat-experience";
import { celestialBodies } from "@/data/celestial-bodies";
import { knowledgeCards } from "@/data/knowledge-cards";
import { getChatRuntimeStatus } from "@/lib/chat";

interface ChatDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatDetailPage({ params }: ChatDetailPageProps) {
  const { id } = await params;
  const body = celestialBodies.find((item) => item.id === id);
  const runtime = getChatRuntimeStatus();

  if (!body) {
    notFound();
  }

  const card = knowledgeCards[body.id];

  if (!card) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <a href="/chat" className="text-sm text-sky-200">
        ← 返回星体选择
      </a>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-4xl">
            {body.avatar}
          </div>
          <div>
            <p className="text-sm text-sky-200">{body.type}</p>
            <h1 className="text-3xl font-semibold text-white">{body.name}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-200/90">{body.tagline}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-3xl bg-slate-950/25 p-4 text-sm leading-7 text-slate-200/90">
          <div>
            <p>
              <span className="text-sky-200">说话风格：</span>
              {body.tone}
            </p>
            <p className="mt-2">
              <span className="text-sky-200">星星性格：</span>
              {body.personality}
            </p>
          </div>
          <a
            href={`/knowledge/${body.id}`}
            className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
          >
            查看知识卡片
          </a>
        </div>

        <div className="mt-4 rounded-3xl border border-sky-200/10 bg-sky-300/10 p-4 text-sm leading-7 text-sky-50">
          <p className="text-sm text-sky-200">当前回答方式</p>
          <p className="mt-2">{runtime.detail}</p>
        </div>
      </section>

      <ChatExperience body={body} knowledgeSummary={card.summary} initialRuntime={runtime} />
    </main>
  );
}
