export interface ClassroomModule {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  duration: string;
  level: string;
  goal: string;
  keyIdeas: string[];
  activities: string[];
  mythVsFact: {
    myth: string;
    fact: string;
  };
  reviewPrompt: string;
  relatedBodyIds: string[];
}

export const classroomModules: ClassroomModule[] = [
  {
    id: "solar-system",
    title: "太阳系邻居课",
    subtitle: "从太阳出发，认识行星、卫星与气态巨行星的分工。",
    icon: "☀️",
    duration: "6 分钟",
    level: "入门",
    goal: "让学习者理解太阳系不是一串名字，而是由恒星、行星、卫星和小天体共同组成的系统。",
    keyIdeas: ["太阳提供主要能量和引力中心", "类地行星更靠内侧，气态巨行星体积更大", "月球这样的天然卫星围绕行星运行"],
    activities: ["按离太阳远近排列太阳、水星、金星、地球、火星、木星、土星", "任选一颗行星，说出它最适合被记住的一个科学特征"],
    mythVsFact: {
      myth: "行星只是夜空里会发亮的小点。",
      fact: "行星本身通常不发光，我们看到的是它们反射的太阳光；它们也拥有真实的轨道、结构和环境差异。",
    },
    reviewPrompt: "如果你要给第一次观星的朋友介绍太阳系，会先讲哪三颗星体？为什么？",
    relatedBodyIds: ["sun", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "moon"],
  },
  {
    id: "night-sky",
    title: "夜空识别课",
    subtitle: "用北极星、北斗七星和猎户座建立第一张夜空地图。",
    icon: "✦",
    duration: "5 分钟",
    level: "入门",
    goal: "帮助学习者掌握最基础的肉眼观星线索，知道怎样从醒目标志找到方向和星座。",
    keyIdeas: ["北极星靠近天球北极，适合在北半球辅助辨认北方", "北斗七星是大熊座的一部分，不是独立星座", "猎户座腰带三星是冬季夜空中很适合入门的识别特征"],
    activities: ["用北斗七星勺口前端两颗星的连线延长寻找北极星", "在冬季夜空先找腰带三星，再认识猎户座中的亮星和星云"],
    mythVsFact: {
      myth: "星座里的星星在宇宙中真的排成同一个图案。",
      fact: "星座是从地球视角划分天空和连线想象的方式，许多星彼此距离可能非常遥远。",
    },
    reviewPrompt: "北极星为什么有用？它是不是因为最亮才重要？",
    relatedBodyIds: ["polaris", "big-dipper", "orion", "sirius"],
  },
  {
    id: "cosmic-scale",
    title: "宇宙尺度课",
    subtitle: "把“很远、很大、很久”变成能比较的概念。",
    icon: "🌌",
    duration: "7 分钟",
    level: "进阶入门",
    goal: "让学习者通过太阳、地球、月球和恒星的比较，建立尺度感而不是只记孤立数字。",
    keyIdeas: ["月球离地球约 38.4 万千米，已经远到能放下许多个地球直径", "太阳占太阳系绝大多数质量，是地球能量来源", "夜空中亮度受天体本身亮度和距离共同影响"],
    activities: ["把地球想象成一颗小珠子，再估算月球应放在多远的位置", "比较太阳、木星、地球和月球，讨论质量与体积为什么会影响天体角色"],
    mythVsFact: {
      myth: "看起来越亮的星一定离我们越近。",
      fact: "视亮度同时取决于真实亮度和距离；天狼星明亮既因为本身较亮，也因为距离相对较近。",
    },
    reviewPrompt: "为什么说理解宇宙尺度时，比较关系往往比背单个数字更重要？",
    relatedBodyIds: ["sun", "earth", "moon", "jupiter", "sirius", "milky-way", "andromeda"],
  },
  {
    id: "stargazing-basics",
    title: "观星准备课",
    subtitle: "用安全、轻量的方法完成一次真实夜空观察。",
    icon: "🔭",
    duration: "5 分钟",
    level: "实践",
    goal: "让学习者知道观星前要考虑时间、方向、天气、光污染和安全边界。",
    keyIdeas: ["晴朗少云、远离强光的地点更适合观星", "月相会影响暗弱天体的可见度", "不要用肉眼、望远镜或相机直视太阳，除非使用合规太阳观测设备"],
    activities: ["选择一个目标：月球、北极星、猎户座或天狼星，并写下适合观察的时间条件", "准备一次 15 分钟观星：确认天气、路线安全、保暖和照明"],
    mythVsFact: {
      myth: "只要有望远镜，就一定能看到所有天体细节。",
      fact: "观测效果受天气、光污染、目标高度、设备口径和使用经验共同影响；肉眼目标也很适合入门。",
    },
    reviewPrompt: "如果今晚只能观察一个目标，你会选月球、北极星还是猎户座？请说明条件。",
    relatedBodyIds: ["moon", "polaris", "orion", "sirius", "big-dipper"],
  },
  {
    id: "comets-and-small-bodies",
    title: "彗星和小天体课",
    subtitle: "认识哈雷彗星、谷神星和太阳系里的小小旅行者。",
    icon: "☄️",
    duration: "6 分钟",
    level: "入门",
    goal: "让孩子知道太阳系不只有行星，还有彗星、矮行星和小行星带里的许多成员。",
    keyIdeas: ["彗星靠近太阳时会出现彗发和彗尾", "小行星带位于火星和木星之间", "矮行星也绕太阳运行，但和八大行星分类不同"],
    activities: ["画一条哈雷彗星的大椭圆轨道，标出它靠近太阳时尾巴变明显", "把太阳、火星、谷神星、木星按大致位置排一排"],
    mythVsFact: {
      myth: "彗星出现一定代表特殊预兆。",
      fact: "彗星是按照轨道运行的太阳系小天体。它们让人惊叹，但科学上不代表预言。",
    },
    reviewPrompt: "彗星和流星有什么不同？你会怎样用一句话解释给朋友听？",
    relatedBodyIds: ["halley", "ceres", "mars", "jupiter"],
  },
  {
    id: "deep-space",
    title: "深空旅行课",
    subtitle: "从银河系出发，看看星云和邻居星系。",
    icon: "🌌",
    duration: "7 分钟",
    level: "进阶入门",
    goal: "帮助孩子把视线从太阳系扩展到星云、星系和更大的宇宙结构。",
    keyIdeas: ["银河系是太阳所在的星系", "星云可以是恒星诞生的地方", "仙女座星系离我们非常远，但在暗夜里仍可能被看到"],
    activities: ["把太阳系想象成一间小屋，银河系想象成一座大城市，说说两者尺度差异", "在猎户座方向找一找猎户座大星云的位置线索"],
    mythVsFact: {
      myth: "夜空中的亮带是一条真正发光的河。",
      fact: "银河亮带是许多遥远恒星的光混在一起，从地球视角看像一条淡淡的河。",
    },
    reviewPrompt: "为什么说银河系像星星城市？星云又为什么像恒星宝宝的育儿室？",
    relatedBodyIds: ["milky-way", "andromeda", "orion-nebula", "orion"],
  },
  {
    id: "exoplanets",
    title: "系外行星课",
    subtitle: "认识绕着别的恒星转的遥远行星。",
    icon: "🪐",
    duration: "6 分钟",
    level: "进阶入门",
    goal: "让孩子理解系外行星的意思，并知道“可能适居”不等于已经发现生命。",
    keyIdeas: ["系外行星是太阳系之外、绕其他恒星运行的行星", "科学家常通过恒星亮度变化等方法发现它们", "适居带只是研究线索，需要更多证据才能判断环境"],
    activities: ["用手电筒当恒星、小纸片当行星，模拟行星经过恒星前方时亮度变暗", "写下一个关于远方行星的问题，并标出哪些是事实、哪些只是猜想"],
    mythVsFact: {
      myth: "发现类似地球的行星，就等于发现外星生命。",
      fact: "类似地球或位于适居带只是值得研究，不代表已经有生命。",
    },
    reviewPrompt: "如果你是天文学家，会先测 TRAPPIST-1e 的哪个线索？为什么？",
    relatedBodyIds: ["trappist-1e"],
  },
];

export function getClassroomModule(id: string) {
  return classroomModules.find((module) => module.id === id);
}
