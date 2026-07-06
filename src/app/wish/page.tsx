import { StarWishExperience } from "@/components/star-wish-experience";
import { PageHeader } from "@/components/page-header";

export default function WishPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-24 pt-8">
      <PageHeader
        label="星空愿望卡"
        title="把一个愿望交给今晚的星光"
        description="选择一位星体伙伴，写下安全、温柔、适合分享的愿望。星星会给你一段回应，并生成可截图或保存的愿望卡。"
        accent="fuchsia"
      >
        <a href="/wish-wall" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
          去愿望墙
        </a>
        <a href="/chat" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
          先找星星朋友
        </a>
      </PageHeader>

      <section className="mt-5">
        <StarWishExperience />
      </section>
    </main>
  );
}
