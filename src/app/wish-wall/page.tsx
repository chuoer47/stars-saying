import { WishWallExperience } from "@/components/wish-wall-experience";
import { PageHeader } from "@/components/page-header";

export default function WishWallPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-24 pt-8">
      <PageHeader
        label="愿望墙"
        title="把愿望星星挂起来"
        description="安全的愿望卡会在这里展示，可以和家人同学一起分享。"
        accent="emerald"
      >
        <a href="/wish" className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950">
          生成新愿望卡
        </a>
        <a href="/chat" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
          找星星聊天
        </a>
      </PageHeader>

      <section className="mt-5">
        <WishWallExperience />
      </section>
    </main>
  );
}
