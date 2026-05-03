import "server-only";

import { generateText } from "ai";

import { createConfiguredOpenAI, getRuntimeModelConfig } from "@/lib/model-config";
import type { OfficialAstronomyResult } from "@/lib/official-astronomy";
import type { ExplorationPersonality, ExplorationSeed } from "@/types/exploration";

const openai = createConfiguredOpenAI();

function getModelName() {
  return getRuntimeModelConfig().chatModel;
}

function fallbackPersonality(seed: ExplorationSeed, official: OfficialAstronomyResult): ExplorationPersonality {
  const officialFactText = official.facts
    .filter((fact) => fact.source !== "探索目录")
    .slice(0, 2)
    .map((fact) => `${fact.label}是${fact.value}`)
    .join("，");

  const summary = officialFactText
    ? `${seed.name}是${seed.type}，${officialFactText}。${seed.childHint}`
    : `${seed.name}是${seed.type}。${seed.childHint}`;

  return {
    summary,
    personality: `像一位会分享发现的小小宇宙向导，先说事实，再用孩子能听懂的比喻解释${seed.name}。`,
    tone: "温柔、好奇、短句子、适合朗读",
    greeting: `你好呀，我是${seed.name}。你可以问我从哪里来、为什么特别，或者我在宇宙里像什么。`,
    voiceLine: `${seed.name}悄悄亮了一下：${summary}`,
    suggestedQuestions: [
      `你为什么叫${seed.name}？`,
      `你最特别的地方是什么？`,
      `如果我要记住你，只要记哪一句？`,
    ],
  };
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw = fenced ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start < 0 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(raw.slice(start, end + 1)) as Partial<ExplorationPersonality>;
  } catch {
    return null;
  }
}

function normalizeGenerated(
  generated: Partial<ExplorationPersonality> | null,
  fallback: ExplorationPersonality,
): ExplorationPersonality {
  const suggestedQuestions = Array.isArray(generated?.suggestedQuestions)
    ? generated?.suggestedQuestions
        ?.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .slice(0, 3)
    : fallback.suggestedQuestions;

  return {
    summary:
      typeof generated?.summary === "string" && generated.summary.trim()
        ? generated.summary.trim().slice(0, 180)
        : fallback.summary,
    personality:
      typeof generated?.personality === "string" && generated.personality.trim()
        ? generated.personality.trim().slice(0, 180)
        : fallback.personality,
    tone:
      typeof generated?.tone === "string" && generated.tone.trim()
        ? generated.tone.trim().slice(0, 80)
        : fallback.tone,
    greeting:
      typeof generated?.greeting === "string" && generated.greeting.trim()
        ? generated.greeting.trim().slice(0, 140)
        : fallback.greeting,
    voiceLine:
      typeof generated?.voiceLine === "string" && generated.voiceLine.trim()
        ? generated.voiceLine.trim().slice(0, 180)
        : fallback.voiceLine,
    suggestedQuestions: suggestedQuestions?.length ? suggestedQuestions : fallback.suggestedQuestions,
  };
}

export async function generateExplorationPersonality(
  seed: ExplorationSeed,
  official: OfficialAstronomyResult,
): Promise<ExplorationPersonality> {
  const fallback = fallbackPersonality(seed, official);

  if (!openai) {
    return fallback;
  }

  try {
    const result = await generateText({
      model: openai(getModelName()),
      system: [
        "你为儿童天文 App 生成星体资料。",
        "必须使用中文，面向 6-12 岁儿童，短句、温柔、准确。",
        "只依据提供的官方资料和探索提示，不要编造关键科学数据。",
        "不要收集或要求儿童个人信息。",
        "输出必须是 JSON，不要额外解释。",
      ].join("\n"),
      prompt: [
        `星体名称：${seed.name} (${seed.englishName})`,
        `类型：${seed.type}`,
        `探索提示：${seed.childHint}`,
        `官方状态：${official.status}`,
        `官方事实：${official.facts.map((fact) => `${fact.label}=${fact.value}（${fact.source}）`).join("；") || "暂无"}`,
        `官方图片说明：${official.image?.title ?? "暂无"}；${official.image?.description ?? ""}`,
        [
          "请生成 JSON：",
          "{",
          '  "summary": "80字以内科普说明",',
          '  "personality": "80字以内星体专属性格设定",',
          '  "tone": "说话风格",',
          '  "greeting": "对儿童的第一句问候",',
          '  "voiceLine": "适合语音朗读的100字以内内容",',
          '  "suggestedQuestions": ["问题1","问题2","问题3"]',
          "}",
        ].join("\n"),
      ].join("\n\n"),
    });

    return normalizeGenerated(extractJson(result.text), fallback);
  } catch {
    return fallback;
  }
}
