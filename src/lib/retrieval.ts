import { celestialBodies } from "@/data/celestial-bodies";
import { classroomModules } from "@/data/classroom-modules";
import { knowledgeCards } from "@/data/knowledge-cards";

export type RetrievalDocumentType = "body" | "knowledge" | "culture" | "classroom";

export interface RetrievalDocument {
  id: string;
  type: RetrievalDocumentType;
  title: string;
  summary: string;
  href: string;
  bodyId?: string;
  keywords: string[];
  content: string;
}

export interface RetrievalResult extends RetrievalDocument {
  score: number;
  matchedTerms: string[];
}

const minimumScore = 0.06;

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function tokenize(text: string) {
  const normalized = normalize(text);
  const terms = new Set<string>();
  const chunks = normalized.match(/[\p{Script=Han}]+|[a-z0-9]+/gu) ?? [];

  for (const chunk of chunks) {
    if (chunk.length >= 2) {
      terms.add(chunk);
    }

    if (/^[\p{Script=Han}]+$/u.test(chunk)) {
      for (let index = 0; index < chunk.length - 1; index += 1) {
        terms.add(chunk.slice(index, index + 2));
      }
    }
  }

  return Array.from(terms);
}

function buildTermMap(text: string) {
  const map = new Map<string, number>();

  for (const token of tokenize(text)) {
    map.set(token, (map.get(token) ?? 0) + 1);
  }

  return map;
}

function cosineScore(queryTerms: Map<string, number>, documentTerms: Map<string, number>) {
  let dot = 0;
  let queryMagnitude = 0;
  let documentMagnitude = 0;

  for (const value of queryTerms.values()) {
    queryMagnitude += value * value;
  }

  for (const value of documentTerms.values()) {
    documentMagnitude += value * value;
  }

  for (const [term, queryValue] of queryTerms.entries()) {
    dot += queryValue * (documentTerms.get(term) ?? 0);
  }

  if (!queryMagnitude || !documentMagnitude) {
    return 0;
  }

  return dot / (Math.sqrt(queryMagnitude) * Math.sqrt(documentMagnitude));
}

export function buildRetrievalDocuments(): RetrievalDocument[] {
  const bodyDocuments = celestialBodies.map((body) => ({
    id: `body:${body.id}`,
    type: "body" as const,
    title: body.name,
    summary: body.tagline,
    href: `/chat/${body.id}`,
    bodyId: body.id,
    keywords: [body.name, body.type, body.category, ...body.tags, ...body.suggestedQuestions],
    content: [body.name, body.type, body.tagline, body.personality, body.tone, ...body.tags, ...body.suggestedQuestions].join(" "),
  }));

  const knowledgeDocuments = Object.values(knowledgeCards).flatMap((card) => {
    const body = celestialBodies.find((item) => item.id === card.bodyId);
    const title = body?.name ?? card.bodyId;

    return [
      {
        id: `knowledge:${card.bodyId}`,
        type: "knowledge" as const,
        title: `${title} · 科学知识`,
        summary: card.summary,
        href: `/knowledge/${card.bodyId}`,
        bodyId: card.bodyId,
        keywords: [
          title,
          ...card.keyFacts.map((fact) => `${fact.label}${fact.value}`),
          ...card.features,
          card.misconception,
          card.funFact,
        ],
        content: [
          title,
          card.summary,
          ...card.keyFacts.map((fact) => `${fact.label} ${fact.value}`),
          ...card.features,
          card.misconception,
          card.funFact,
        ].join(" "),
      },
      {
        id: `culture:${card.bodyId}`,
        type: "culture" as const,
        title: `${title} · 文化边界`,
        summary: card.culture,
        href: `/knowledge/${card.bodyId}`,
        bodyId: card.bodyId,
        keywords: [title, "文化", "神话", "传说", card.culture],
        content: [title, "文化 神话 传说 科学事实", card.culture, card.summary].join(" "),
      },
    ];
  });

  const classroomDocuments = classroomModules.map((module) => ({
    id: `classroom:${module.id}`,
    type: "classroom" as const,
    title: module.title,
    summary: module.subtitle,
    href: `/classroom/${module.id}`,
    keywords: [module.title, module.subtitle, module.goal, ...module.keyIdeas, ...module.activities],
    content: [
      module.title,
      module.subtitle,
      module.goal,
      ...module.keyIdeas,
      ...module.activities,
      module.mythVsFact.myth,
      module.mythVsFact.fact,
      module.reviewPrompt,
    ].join(" "),
  }));

  return [...bodyDocuments, ...knowledgeDocuments, ...classroomDocuments];
}

export function semanticSearch(query: string, limit = 8): RetrievalResult[] {
  const queryMap = buildTermMap(query);

  if (!query.trim() || queryMap.size === 0) {
    return [];
  }

  return buildRetrievalDocuments()
    .map((document) => {
      const documentMap = buildTermMap([document.title, document.summary, document.content, ...document.keywords].join(" "));
      const score = cosineScore(queryMap, documentMap);
      const matchedTerms = Array.from(queryMap.keys()).filter((term) => documentMap.has(term)).slice(0, 6);

      return {
        ...document,
        score,
        matchedTerms,
      };
    })
    .filter((result) => result.score >= minimumScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function buildRetrievalContext(query: string, limit = 3) {
  const results = semanticSearch(query, limit);

  if (!results.length) {
    return "未检索到额外语义片段。";
  }

  return results
    .map((result, index) => `${index + 1}. ${result.title}：${result.summary}`)
    .join("\n");
}
