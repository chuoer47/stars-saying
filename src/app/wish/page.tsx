import { StarWishExperience } from "@/components/star-wish-experience";

export default function WishPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <a href="/" className="text-sm text-sky-200">
        ← 返回首页
      </a>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <p className="text-sm text-sky-200">星空愿望卡</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">把一个愿望交给今晚的星光</h1>
        <p className="mt-3 text-sm leading-7 text-slate-200/90">
          选择一位星体伙伴，写下安全、温柔、适合分享的愿望。星星会给你一段回应，并生成可截图或保存的愿望卡。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="/wish-wall" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            去愿望墙
          </a>
          <a href="/chat" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            先找星星朋友
          </a>
        </div>
      </section>

      <section className="mt-5">
        <StarWishExperience />
      </section>
    </main>
  );
}
