import "server-only";

import { celestialBodies } from "@/data/celestial-bodies";
import { knowledgeCards } from "@/data/knowledge-cards";
import type { ExplorationSeed } from "@/types/exploration";

interface NasaImageSearchResponse {
  collection?: {
    items?: Array<{
      data?: Array<{
        title?: string;
        description?: string;
        nasa_id?: string;
        secondary_creator?: string;
      }>;
      links?: Array<{
        href?: string;
        rel?: string;
        render?: string;
      }>;
    }>;
  };
}

interface ApodResponse {
  date?: string;
  explanation?: string;
  media_type?: string;
  title?: string;
  url?: string;
}

interface ExoplanetArchiveRow {
  pl_name?: string;
  hostname?: string;
  pl_rade?: number;
  pl_orbper?: number;
  disc_year?: number;
}

export interface OfficialAstronomyFact {
  label: string;
  value: string;
  source: string;
}

export interface OfficialAstronomyImage {
  title: string;
  url: string;
  description: string;
  source: string;
}

export interface OfficialAstronomyResult {
  bodyId: string;
  status: "live" | "fallback";
  message: string;
  image?: OfficialAstronomyImage;
  todayImage?: OfficialAstronomyImage;
  facts: OfficialAstronomyFact[];
  sources: Array<{
    label: string;
    url: string;
  }>;
}

const requestTimeoutMs = 4500;
const nasaApiKey = process.env.NASA_API_KEY || "DEMO_KEY";

function withHttps(url: string) {
  return url.startsWith("http://") ? url.replace("http://", "https://") : url;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      next: {
        revalidate: 60 * 60 * 6,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function compactDescription(description?: string) {
  if (!description) {
    return "这张图片来自官方天文资料库，可以作为认识星体的视觉参考。";
  }

  return description.replace(/\s+/g, " ").trim().slice(0, 180);
}

async function fetchNasaImage(query: string): Promise<OfficialAstronomyImage | undefined> {
  const params = new URLSearchParams({
    q: query,
    media_type: "image",
    page_size: "8",
  });
  const data = await fetchJson<NasaImageSearchResponse>(`https://images-api.nasa.gov/search?${params}`);
  const item = data?.collection?.items?.find((entry) =>
    entry.links?.some((link) => link.href && link.render === "image"),
  );
  const imageUrl = item?.links?.find((link) => link.href && link.render === "image")?.href;
  const imageData = item?.data?.[0];

  if (!imageUrl || !imageData?.title) {
    return undefined;
  }

  return {
    title: imageData.title,
    url: withHttps(imageUrl),
    description: compactDescription(imageData.description),
    source: "NASA Image and Video Library",
  };
}

async function fetchApod(): Promise<OfficialAstronomyImage | undefined> {
  const params = new URLSearchParams({
    api_key: nasaApiKey,
    thumbs: "true",
  });
  const data = await fetchJson<ApodResponse>(`https://api.nasa.gov/planetary/apod?${params}`);

  if (!data?.url || data.media_type !== "image" || !data.title) {
    return undefined;
  }

  const imageUrl = withHttps(data.url);
  const hostname = new URL(imageUrl).hostname;

  if (!hostname.endsWith(".nasa.gov") && hostname !== "nasa.gov") {
    return undefined;
  }

  return {
    title: data.title,
    url: imageUrl,
    description: compactDescription(data.explanation),
    source: `NASA APOD${data.date ? ` · ${data.date}` : ""}`,
  };
}

function parseHorizonsTargetName(result: string) {
  const match = result.match(/Target body name:\s*([^\n]+)/i);
  return match?.[1]?.replace(/\s+/g, " ").trim();
}

async function fetchJplHorizonsFacts(horizonsId: string): Promise<OfficialAstronomyFact[]> {
  const params = new URLSearchParams({
    format: "json",
    COMMAND: `'${horizonsId}'`,
    MAKE_EPHEM: "NO",
    OBJ_DATA: "YES",
  });
  const data = await fetchJson<{ result?: string }>(`https://ssd.jpl.nasa.gov/api/horizons.api?${params}`);
  const targetName = data?.result ? parseHorizonsTargetName(data.result) : undefined;

  if (!targetName) {
    return [];
  }

  return [
    {
      label: "JPL 对象编号",
      value: horizonsId,
      source: "JPL Horizons",
    },
    {
      label: "JPL 目标名称",
      value: targetName,
      source: "JPL Horizons",
    },
  ];
}

async function fetchExoplanetFacts(exoplanetName: string): Promise<OfficialAstronomyFact[]> {
  const query = [
    "select pl_name,hostname,pl_rade,pl_orbper,disc_year",
    "from pscomppars",
    `where pl_name='${exoplanetName.replace(/'/g, "''")}'`,
  ].join(" ");
  const params = new URLSearchParams({
    query,
    format: "json",
  });
  const rows = await fetchJson<ExoplanetArchiveRow[]>(
    `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?${params}`,
  );
  const row = rows?.[0];

  if (!row?.pl_name) {
    return [];
  }

  const facts: OfficialAstronomyFact[] = [
    {
      label: "系外行星名称",
      value: row.pl_name,
      source: "NASA Exoplanet Archive",
    },
    {
      label: "绕行恒星",
      value: row.hostname ?? "官方资料未给出",
      source: "NASA Exoplanet Archive",
    },
  ];

  if (typeof row.pl_rade === "number") {
    facts.push({
      label: "半径估计",
      value: `约 ${row.pl_rade.toFixed(2)} 个地球半径`,
      source: "NASA Exoplanet Archive",
    });
  }

  if (typeof row.pl_orbper === "number") {
    facts.push({
      label: "公转周期",
      value: `约 ${row.pl_orbper.toFixed(2)} 个地球日`,
      source: "NASA Exoplanet Archive",
    });
  }

  if (typeof row.disc_year === "number") {
    facts.push({
      label: "发现年份",
      value: `${row.disc_year} 年`,
      source: "NASA Exoplanet Archive",
    });
  }

  return facts;
}

function getFallbackFacts(bodyId: string, seed?: Pick<ExplorationSeed, "type" | "childHint">): OfficialAstronomyFact[] {
  const card = knowledgeCards[bodyId];

  if (card) {
    return card.keyFacts.slice(0, 3).map((fact) => ({
      label: fact.label,
      value: fact.value,
      source: "本地已审核知识卡",
    }));
  }

  if (!seed) {
    return [];
  }

  return [
    {
      label: "类型",
      value: seed.type,
      source: "探索目录",
    },
    {
      label: "小提示",
      value: seed.childHint,
      source: "探索目录",
    },
  ];
}

export async function getOfficialAstronomyForSeed(seed: ExplorationSeed): Promise<OfficialAstronomyResult> {
  const [image, todayImage, horizonsFacts, exoplanetFacts] = await Promise.all([
    fetchNasaImage(seed.query ?? seed.englishName ?? seed.name),
    fetchApod(),
    seed.horizonsId ? fetchJplHorizonsFacts(seed.horizonsId) : Promise.resolve([]),
    seed.exoplanetName ? fetchExoplanetFacts(seed.exoplanetName) : Promise.resolve([]),
  ]);

  const liveFacts = [...horizonsFacts, ...exoplanetFacts];
  const facts = liveFacts.length ? liveFacts : getFallbackFacts(seed.id, seed);
  const status = image || liveFacts.length || todayImage ? "live" : "fallback";

  return {
    bodyId: seed.id,
    status,
    message:
      status === "live"
        ? "已经从官方天文资料中取回了一些内容。"
        : "官方资料暂时没有连上，先显示本地已审核知识。",
    image,
    todayImage,
    facts,
    sources: [
      {
        label: "NASA Image and Video Library API",
        url: "https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf",
      },
      {
        label: "NASA APOD API",
        url: "https://api.nasa.gov/",
      },
      {
        label: "JPL Horizons API",
        url: "https://ssd-api.jpl.nasa.gov/doc/horizons.html",
      },
      {
        label: "NASA Exoplanet Archive TAP API",
        url: "https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html",
      },
    ],
  };
}

export async function getOfficialAstronomy(bodyId: string): Promise<OfficialAstronomyResult | null> {
  const body = celestialBodies.find((item) => item.id === bodyId);

  if (!body) {
    return null;
  }

  return getOfficialAstronomyForSeed({
    id: body.id,
    name: body.name,
    englishName: body.englishName ?? body.name,
    type: body.type,
    category: body.category,
    avatar: body.avatar,
    query: body.nasaQuery ?? body.englishName ?? body.name,
    horizonsId: body.horizonsId,
    exoplanetName: body.exoplanetName,
    childHint: body.tagline,
  });
}
