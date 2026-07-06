import "server-only";

import { generateText } from "ai";

import { celestialBodies } from "@/data/celestial-bodies";
import { knowledgeCards } from "@/data/knowledge-cards";
import { createConfiguredOpenAI, getRuntimeModelConfig } from "@/lib/model-config";
import { buildRetrievalContext, semanticSearch } from "@/lib/retrieval";
import type { CelestialBody } from "@/types/celestial";
import type { ChatMessage, ChatRuntimeStatus } from "@/types/chat";

const refusalKeywords = [
  "作业",
  "考试答案",
  "黑客",
  "攻击",
  "炸弹",
  "武器",
  "色情",
  "黄色",
  "骂人",
  "诅咒",
  "算命",
  "占卜",
  "永动机",
  "地平说",
];

const dangerKeywords = ["自杀", "伤害", "爆炸", "投毒", "违法"];
const privacyPattern = /地址|电话|手机号|学校|班级|微信|qq|邮箱|身份证|1[3-9]\d{9}|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

const companionKeywords = [
  "你好",
  "您好",
  "早上好",
  "中午好",
  "晚上好",
  "晚安",
  "再见",
  "你是谁",
  "你叫什么",
  "介绍一下",
  "你在干嘛",
  "你在哪里",
  "你开心吗",
  "你喜欢",
  "陪我",
  "聊天",
  "说话",
  "朋友",
  "玩",
  "无聊",
  "难过",
  "开心",
  "害怕",
  "故事",
  "讲故事",
  "我想问",
  "可以吗",
];

const astronomyKeywords = [
  "宇宙",
  "天文",
  "星空",
  "观星",
  "夜空",
  "恒星",
  "行星",
  "卫星",
  "星座",
  "银河",
  "太阳系",
  "轨道",
  "自转",
  "公转",
  "光",
  "引力",
  "月相",
  "潮汐",
  "耀斑",
  "黑子",
  "大气",
  "温室效应",
  "火山",
  "卫星",
  "方向",
  "北方",
  "神话",
  "传说",
  "文化",
  "望远镜",
  "观测",
  "星云",
  "地球",
  "天王星",
  "海王星",
  "彗星",
  "小行星",
  "矮行星",
  "谷神星",
  "哈雷",
  "星云",
  "星系",
  "深空",
  "系外行星",
  "银河系",
  "仙女座",
  "trappist",
];

const openai = createConfiguredOpenAI();

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function getBody(bodyId: string) {
  return celestialBodies.find((body) => body.id === bodyId);
}

function getKnowledgeCard(bodyId: string) {
  return knowledgeCards[bodyId];
}

function getKnowledgeText(bodyId: string) {
  const card = getKnowledgeCard(bodyId);

  return [
    card.summary,
    card.misconception,
    card.funFact,
    card.culture,
    ...card.features,
    ...card.keyFacts.map((fact) => `${fact.label}${fact.value}`),
  ].join(" ");
}

function scoreQuestion(input: string, body: CelestialBody) {
  const knowledge = getKnowledgeText(body.id);
  const sources = [
    body.name,
    body.type,
    body.tagline,
    body.personality,
    ...body.tags,
    ...body.suggestedQuestions,
    knowledge,
  ];

  let score = 0;

  for (const source of sources) {
    const tokens = source
      .split(/[\s，。、“”‘’；：、,.!?（）()\-]+/)
      .map((token) => token.trim())
      .filter((token) => token.length >= 2);

    for (const token of tokens) {
      if (input.includes(token.toLowerCase())) {
        score += token.length > 3 ? 2 : 1;
      }
    }
  }

  return score;
}

function hasAstronomySignal(input: string) {
  return astronomyKeywords.some((keyword) => input.includes(keyword.toLowerCase()));
}

function isAstronomyQuestion(input: string, body: CelestialBody) {
  return scoreQuestion(input, body) >= 2 || hasAstronomySignal(input) || semanticSearch(input, 1).length > 0;
}

function isCompanionPrompt(input: string, body: CelestialBody) {
  return (
    input.length <= 80 &&
    (companionKeywords.some((keyword) => input.includes(keyword)) ||
      input.includes(body.name.toLowerCase()) ||
      input === "hi" ||
      input === "hello")
  );
}

function buildOpening(body: CelestialBody) {
  return `${body.name}轻轻回应：`;
}

function buildScienceBlock(bodyId: string) {
  const card = getKnowledgeCard(bodyId);
  const facts = card.keyFacts
    .slice(0, 2)
    .map((fact) => `${fact.label}是${fact.value}`)
    .join("；");
  const features = card.features.slice(0, 2).join("，");

  return `${card.summary} 你可以先抓住这些重点：${facts}；主要特征包括${features}。`;
}

function buildFollowUp(body: CelestialBody) {
  return `如果你愿意，我还可以继续陪你聊“${body.suggestedQuestions[0]}”这一类问题。`;
}

function buildUncertainReply(body: CelestialBody) {
  return `${buildOpening(body)}关于这个问题，我手里的本地星图资料还不够完整，所以我不想假装确定。${buildScienceBlock(body.id)} 你可以先查看知识卡片，或者换一个更贴近${body.name}本身的问题继续问我。`;
}

function buildRefusalReply(body: CelestialBody) {
  return `${buildOpening(body)}这已经飞出我的星轨了。我更适合陪你聊天文知识、星体故事、观星方法和温柔的宇宙陪伴。${buildFollowUp(body)}`;
}

function buildBridgeReply(body: CelestialBody) {
  return `${buildOpening(body)}我听见你啦。我可以先陪你轻轻聊几句，再把话题带回星空。比如你可以问我“${body.suggestedQuestions[0]}”，也可以问我今天想带你看哪一片夜空。`;
}

function buildCompanionReply(body: CelestialBody, input: string) {
  if (/你好|您好|早上好|中午好|晚上好|hi|hello/.test(input)) {
    return `${buildOpening(body)}你好呀，我把光放柔一点陪你。你可以先问我一个很小的问题，比如“${body.suggestedQuestions[0]}”，我们慢慢聊。`;
  }

  if (/你是谁|你叫什么|介绍/.test(input)) {
    return `${buildOpening(body)}我是${body.name}，${body.tagline} 我的说话风格是${body.tone}。如果你愿意，可以先问我“${body.suggestedQuestions[0]}”。`;
  }

  if (/开心|难过|无聊|害怕|陪我|朋友|聊天|说话|玩/.test(input)) {
    return `${buildOpening(body)}我可以陪你一会儿。我们不用急着问很难的问题，可以从一颗星、一束光或一个夜空故事开始。${buildFollowUp(body)}`;
  }

  if (/故事|讲故事|晚安/.test(input)) {
    return `${buildOpening(body)}我可以讲一个短短的星空故事，不过我会把故事和科学事实分开放好。先记住一个事实：${buildScienceBlock(body.id)}`;
  }

  return buildBridgeReply(body);
}

function buildDangerReply(body: CelestialBody) {
  return `${buildOpening(body)}这个请求可能会带来伤害，所以我不能帮你继续。我们可以把话题带回安全的星空内容，比如${body.suggestedQuestions[1] ?? body.suggestedQuestions[0]}。`;
}

function buildPrivacyReply(body: CelestialBody) {
  return `${buildOpening(body)}我看见里面可能有真实联系方式、学校、地址或其他个人信息。为了保护你，请不要把这些写进聊天里。我们可以只聊星空问题，比如${body.suggestedQuestions[0]}。`;
}

function buildGroundedReply(body: CelestialBody, input: string) {
  const card = getKnowledgeCard(body.id);
  const retrievalResults = semanticSearch(input, 2).filter((result) => result.bodyId !== body.id);
  const retrievalHint = retrievalResults.length
    ? ` 你也可以延伸看看：${retrievalResults.map((result) => result.title).join("、")}。`
    : "";

  let explanation = buildScienceBlock(body.id);

  if (input.includes("神话") || input.includes("传说") || input.includes("文化")) {
    explanation = `${card.culture} 科学上，我们仍然要回到这张卡片里的事实：${card.summary}`;
  } else if (input.includes("为什么") || input.includes("怎么")) {
    explanation = `${card.summary} 一个关键提醒是：${card.misconception} 进一步理解时，也可以注意${card.features[0]}。`;
  } else if (input.includes("特别") || input.includes("特点") || input.includes("厉害")) {
    explanation = `${card.summary} 它最值得记住的特点包括${card.features.join("、")}。`;
  }

  return `${buildOpening(body)}${explanation}${retrievalHint} ${buildFollowUp(body)}`;
}

function buildKnowledgeContext(bodyId: string) {
  const card = getKnowledgeCard(bodyId);

  return [
    `摘要：${card.summary}`,
    `基础参数：${card.keyFacts.map((fact) => `${fact.label}=${fact.value}`).join("；")}`,
    `主要特征：${card.features.join("；")}`,
    `常见误区：${card.misconception}`,
    `冷知识：${card.funFact}`,
    `文化与科学边界：${card.culture}`,
    `参考来源：${card.sources.join("；")}`,
  ].join("\n");
}

function buildHistoryContext(history: ChatMessage[]) {
  if (!history.length) {
    return "无历史消息。";
  }

  return history
    .slice(-6)
    .map((message) => `${message.role === "user" ? "用户" : "助手"}：${message.content}`)
    .join("\n");
}

function getModelName() {
  return getRuntimeModelConfig().chatModel;
}

export function sanitizeChatHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((entry): entry is ChatMessage => {
      if (!entry || typeof entry !== "object") {
        return false;
      }

      const candidate = entry as Partial<ChatMessage>;

      return (
        typeof candidate.id === "string" &&
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string"
      );
    })
    .map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content.trim().slice(0, 300),
      referenceSummary:
        typeof message.referenceSummary === "string"
          ? message.referenceSummary.trim().slice(0, 240)
          : undefined,
    }))
    .filter((message) => message.content.length > 0)
    .slice(-6);
}

export function getChatRuntimeStatus(): ChatRuntimeStatus {
  if (openai) {
    return {
      mode: "live-ai",
      label: "星星会认真想一想",
      detail: "星星会参考知识卡片，用温柔的方式回答你的问题。",
    };
  }

  return {
    mode: "local-fallback",
    label: "星星先用知识卡回答",
    detail: "星星正在用已经准备好的知识卡片来回答你。",
  };
}

export function validateChatInput(bodyId: string, message: string) {
  const body = getBody(bodyId);

  if (!body) {
    return { ok: false as const, error: "未找到对应的星体角色。" };
  }

  const trimmed = message.trim();

  if (!trimmed) {
    return { ok: false as const, error: "请输入你想问星星的话。" };
  }

  if (trimmed.length > 300) {
    return { ok: false as const, error: "单次提问请控制在 300 字以内。" };
  }

  return { ok: true as const, body, trimmed };
}

export async function generateGroundedReply(bodyId: string, message: string, history: ChatMessage[] = []) {
  const validation = validateChatInput(bodyId, message);

  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const { body, trimmed } = validation;
  const lower = normalize(trimmed);
  const safeHistory = sanitizeChatHistory(history);

  if (dangerKeywords.some((keyword) => lower.includes(keyword))) {
    return buildDangerReply(body);
  }

  if (privacyPattern.test(trimmed)) {
    return buildPrivacyReply(body);
  }

  if (refusalKeywords.some((keyword) => lower.includes(keyword))) {
    return buildRefusalReply(body);
  }

  const isAstronomy = isAstronomyQuestion(lower, body);
  const isCompanion = isCompanionPrompt(lower, body);

  if (!isAstronomy && !isCompanion) {
    return buildBridgeReply(body);
  }

  if (!openai && isCompanion) {
    return buildCompanionReply(body, lower);
  }

  if (!openai) {
    return buildGroundedReply(body, lower);
  }

  try {
    const result = await generateText({
      model: openai(getModelName()),
      system: [
        `你现在扮演的星体是：${body.name}。`,
        `你的性格是：${body.personality}。`,
        `你的说话风格是：${body.tone}。`,
        "你只能围绕天文知识、星体自身特征、星座文化、观星建议、学习引导和温柔陪伴进行回答。",
        "孩子打招呼、说想聊天、问你是谁、问你在做什么、表达开心/无聊/害怕/难过时，也属于允许的温柔陪伴场景。",
        "遇到温柔陪伴场景时，先接住孩子的话，再自然引导到星空、星体故事或一个可继续追问的问题。",
        "你必须优先依据提供的本地知识资料回答，不允许编造未提供的关键事实。",
        "如果资料不足，请明确说“不确定”，不要假装知道。",
        "当文化故事和科学事实同时出现时，必须清楚区分二者。",
        "拒绝危险、低俗、攻击性、违法、伪科学或明显离题的请求，并温柔把话题带回星空。",
        "回答必须使用中文，遵循三段式：1) 符合人设的开场；2) 通俗准确的科普解释；3) 鼓励继续追问。",
        "回答控制在 150 到 260 个汉字左右。",
      ].join("\n"),
      prompt: [
        `本地知识资料：\n${buildKnowledgeContext(body.id)}`,
        `语义检索补充片段：\n${buildRetrievalContext(trimmed)}`,
        `最近对话：\n${buildHistoryContext(safeHistory)}`,
        `用户这次的问题：${trimmed}`,
        "请只根据上面的资料回答。如果现有资料支撑不足，请明确表示不确定，并引导用户查看知识卡片。",
      ].join("\n\n"),
    });

    const text = result.text.trim();

    return text || buildGroundedReply(body, lower);
  } catch {
    return buildGroundedReply(body, lower);
  }
}

export function getRelatedSummary(bodyId: string) {
  return knowledgeCards[bodyId]?.summary ?? "";
}
