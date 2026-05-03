import { getFeaturedBodies } from "@/data/celestial-bodies";

const highlights = [
  {
    icon: "🎲",
    title: "随机抽一颗新星体",
    description: "从官方天文资料里抽取宇宙朋友，生成专属小性格。",
  },
  {
    icon: "💬",
    title: "问星星一个问题",
    description: "太阳、月球、海王星、星云和星系都会用好懂的话回答你。",
  },
  {
    icon: "📚",
    title: "打开星空图鉴",
    description: "每张知识卡都把事实、误区和有趣故事分开放好。",
  },
  {
    icon: "🎨",
    title: "做一张愿望卡",
    description: "写下安全的小愿望，让星星给你一段温柔回应。",
  },
  {
    icon: "🌈",
    title: "看看愿望墙",
    description: "把本机保存的愿望变成一面小小的星空作品墙。",
  },
];

const journey = [
  "随机抽一颗新星体",
  "听它介绍自己",
  "把喜欢的星体收进记忆库",
];

export default function Home() {
  const featuredBodies = getFeaturedBodies();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-6">
      <div className="mb-5 flex items-center justify-between text-sm text-sky-100/90">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
          儿童星空乐园
        </span>
        <span>假设星星会说话</span>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(250,204,21,0.18),transparent_18%),radial-gradient(circle_at_82%_8%,rgba(56,189,248,0.16),transparent_22%),radial-gradient(circle_at_70%_82%,rgba(168,85,247,0.18),transparent_28%)]" />
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-sky-100/20 bg-sky-200/10 blur-sm" />
        <div className="absolute left-8 top-8 h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_28px_rgba(253,224,71,0.9)]" />
        <div className="absolute bottom-20 right-10 h-2 w-2 rounded-full bg-sky-100 shadow-[0_0_22px_rgba(186,230,253,0.9)]" />
        <div className="relative p-6">
          <p className="mb-3 text-sm font-medium text-amber-100">和星星聊天，用温柔的方式认识宇宙</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            假设星星会说话
          </h1>
          <p className="mt-4 text-base leading-8 text-sky-50/90">
            这里是一座给孩子的星空小屋。你可以问星星问题、看图鉴、做愿望卡，也可以把喜欢的愿望放到本机愿望墙上。
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {featuredBodies.slice(0, 8).map((body) => (
              <a
                key={body.id}
                href={`/chat/${body.id}`}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-sky-50 active-celestial-glow"
              >
                {body.avatar} {body.name}
              </a>
            ))}
          </div>

          <div className="mt-7 grid gap-3">
            <a
              href="/explore"
              className="rounded-2xl bg-amber-300 px-4 py-4 text-center text-base font-semibold text-slate-950 transition hover:bg-amber-200"
            >
              随机抽一颗星
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/chat?category=featured"
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-medium text-white"
              >
                星星聊天
              </a>
              <a
                href="/memory"
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-medium text-white"
              >
                星体记忆库
              </a>
              <a
                href="/wish"
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-medium text-white"
              >
                生成愿望卡
              </a>
              <a
                href="/wish-wall"
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-medium text-white"
              >
                愿望墙
              </a>
              <a
                href="/library"
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-medium text-white"
              >
                星空图鉴
              </a>
              <a
                href="/classroom"
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-medium text-white"
              >
                星空课堂
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-amber-200/20 bg-amber-200/10 p-5 text-sm leading-7 text-amber-50">
        <p className="text-sm font-medium text-amber-100">今天可以这样玩</p>
        <div className="mt-3 grid gap-2">
          {journey.map((step, index) => (
            <div key={step} className="rounded-2xl bg-white/10 px-4 py-3">
              <span className="mr-2 text-amber-200">{index + 1}.</span>
              {step}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                {item.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-sky-50/85">{item.description}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-emerald-200/20 bg-emerald-200/10 p-5 text-sm leading-7 text-emerald-50">
        <p className="text-sm font-medium text-emerald-100">小小安全约定</p>
        <p className="mt-2">
          不写真实姓名、地址、电话和学校。愿望墙只保存在这台设备里，适合在家里或课堂上展示给身边的人看。
        </p>
      </section>
    </main>
  );
}
