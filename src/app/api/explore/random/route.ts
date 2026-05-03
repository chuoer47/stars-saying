import { NextResponse } from "next/server";

import { pickRandomExplorationSeed } from "@/data/exploration-catalog";
import { generateExplorationPersonality } from "@/lib/exploration-generator";
import { getRuntimeModelConfig } from "@/lib/model-config";
import { getOfficialAstronomyForSeed } from "@/lib/official-astronomy";
import type { ExplorationMemoryEntry } from "@/types/exploration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const excludedIds = url.searchParams
    .get("exclude")
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
  const seed = pickRandomExplorationSeed(excludedIds);
  const official = await getOfficialAstronomyForSeed(seed);
  const generated = await generateExplorationPersonality(seed, official);

  const entry: ExplorationMemoryEntry = {
    id: seed.id,
    name: seed.name,
    englishName: seed.englishName,
    type: seed.type,
    category: seed.category,
    avatar: seed.avatar,
    imageUrl: official.image?.url ?? official.todayImage?.url,
    imageTitle: official.image?.title ?? official.todayImage?.title,
    facts: official.facts,
    sources: official.sources.map((source) => source.label),
    generated,
    savedAt: new Date().toISOString(),
    officialStatus: official.status,
  };

  return NextResponse.json(
    {
      entry,
      official,
      model: getRuntimeModelConfig().chatModel,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
