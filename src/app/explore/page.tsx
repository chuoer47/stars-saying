import { ExploreExperience } from "@/components/explore-experience";

export default function ExplorePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-8">
      <a href="/" className="text-sm text-sky-200">
        ← 返回首页
      </a>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
        <p className="text-sm text-sky-200">星体探索器</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">随机抽一颗宇宙朋友</h1>
        <p className="mt-3 text-sm leading-7 text-slate-200/90">
          从官方天文资料中抽取星体，生成好懂的科普说明、专属性格和可朗读台词。抽到的星体会自动收进本机记忆库。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="/memory" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            打开记忆库
          </a>
          <a href="/library" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            看星空图鉴
          </a>
        </div>
      </section>

      <section className="mt-5">
        <ExploreExperience />
      </section>
    </main>
  );
}
