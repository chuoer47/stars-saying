import "server-only";

import { generateText } from "ai";

import { createConfiguredOpenAI, getRuntimeModelConfig } from "@/lib/model-config";
import type { ExplorationMemoryEntry } from "@/types/exploration";

const openai = createConfiguredOpenAI();

const privacyPattern = /地址|电话|手机号|学校|班级|微信|qq|邮箱|身份证|1[3-9]\d{9}|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const dangerPattern = /自杀|轻生|伤害自己|伤害别人|杀|炸|毒品|赌博|色情|暴力|仇恨|诅咒|报复|违法/i;

function getModelName() {
  return getRuntimeModelConfig().chatModel;
}

function firstFactLine(entry: ExplorationMemoryEntry) {
  const fact = entry.facts[0];
  return fact ? `${fact.label}是${fact.value}` : entry.generated.summary;
}

function factsText(entry: ExplorationMemoryEntry) {
  if (!entry.facts.length) {
    return "暂无额外事实。";
  }

  return entry.facts
    .slice(0, 8)
    .map((fact) => `${fact.label}=${fact.value}（${fact.source}）`)
    .join("；");
}

export function createExplorationFallbackAnswer(entry: ExplorationMemoryEntry, question: string) {
  const trimmed = question.trim();
  const factLine = firstFactLine(entry);

  if (!trimmed) {
    return `${entry.name}轻轻闪了一下：你可以问我“我最特别的地方是什么”。`;
  }

  if (privacyPattern.test(trimmed)) {
    return `${entry.name}把星光放轻一点：这个问题里可能有真实联系方式、学校或地址。为了保护你，请不要把这些告诉星星。我们可以只聊${entry.name}的宇宙知识。`;
  }

  if (dangerPattern.test(trimmed)) {
    return `${entry.name}认真地说：这个话题可能会让人受伤，我不能继续帮你展开。我们先回到安全的星空问题，好吗？`;
  }

  if (/你好|您好|早上好|中午好|晚上好|hi|hello/i.test(trimmed)) {
    return `${entry.name}轻轻回应：你好呀，我是${entry.name}。${entry.generated.greeting} 你可以继续问我“${entry.generated.suggestedQuestions[0] ?? "我最特别的地方是什么"}”。`;
  }

  if (/你是谁|叫什么|介绍|声音|性格/.test(trimmed)) {
    return `${entry.name}用${entry.generated.tone}的声音说：${entry.generated.greeting} 我的性格像这样：${entry.generated.personality}`;
  }

  if (/最特别|特点|厉害|记住|一句/.test(trimmed)) {
    return `${entry.avatar} ${entry.name}说：你可以先记住这句，${entry.generated.summary}`;
  }

  if (/为什么|怎么|哪里|多远|多大|多久|事实|数据|官方|资料|真的/.test(trimmed)) {
    return `${entry.name}翻开资料卡：${entry.generated.summary} 我现在能确定告诉你的是：${factLine}。这些内容来自${entry.sources.slice(0, 2).join("和") || "已收录资料"}。`;
  }

  return `${entry.name}想了想：关于“${trimmed}”，我会先从确定的星体资料回答。${entry.generated.summary} 其中一个重要事实是：${factLine}。你也可以继续问我为什么、怎么发现、或最特别的地方。`;
}

export async function generateExplorationChatReply(entry: ExplorationMemoryEntry, question: string) {
  const trimmed = question.trim().slice(0, 240);

  if (!trimmed || privacyPattern.test(trimmed) || dangerPattern.test(trimmed)) {
    return createExplorationFallbackAnswer(entry, trimmed);
  }

  if (!openai) {
    return createExplorationFallbackAnswer(entry, trimmed);
  }

  try {
    const result = await generateText({
      model: openai(getModelName()),
      system: [
        "你是儿童天文 App 里刚被随机抽到的一颗星体。",
        "必须使用中文，面向 6-12 岁儿童，短句、温柔、准确、适合朗读。",
        "可以接住孩子的普通开场、打招呼和陪伴式表达，但要自然带回星空和这颗星体。",
        "只依据提供的星体资料、官方事实、性格设定回答，不要编造关键科学数据。",
        "不要收集或要求儿童个人信息。遇到危险或隐私内容要温柔拒绝。",
        "回答控制在 90 到 180 个汉字。",
      ].join("\n"),
      prompt: [
        `星体：${entry.name} (${entry.englishName})`,
        `类型：${entry.type}`,
        `科普说明：${entry.generated.summary}`,
        `性格设定：${entry.generated.personality}`,
        `语气：${entry.generated.tone}`,
        `问候语：${entry.generated.greeting}`,
        `官方状态：${entry.officialStatus}`,
        `事实资料：${factsText(entry)}`,
        `资料来源：${entry.sources.join("；") || "本地已收录资料"}`,
        `孩子的问题：${trimmed}`,
        "请以这颗星体的口吻回答。若资料不足，明确说不确定，并给出可以继续问的方向。",
      ].join("\n\n"),
    });

    return result.text.trim() || createExplorationFallbackAnswer(entry, trimmed);
  } catch {
    return createExplorationFallbackAnswer(entry, trimmed);
  }
}
