import type { CelestialCategory } from "@/types/celestial";

export interface ExplorationSeed {
  id: string;
  name: string;
  englishName: string;
  type: string;
  category: CelestialCategory;
  avatar: string;
  query: string;
  horizonsId?: string;
  exoplanetName?: string;
  childHint: string;
}

export interface ExplorationPersonality {
  summary: string;
  personality: string;
  tone: string;
  greeting: string;
  voiceLine: string;
  suggestedQuestions: string[];
}

export interface ExplorationMemoryEntry {
  id: string;
  name: string;
  englishName: string;
  type: string;
  category: CelestialCategory;
  avatar: string;
  imageUrl?: string;
  imageTitle?: string;
  facts: Array<{
    label: string;
    value: string;
    source: string;
  }>;
  sources: string[];
  generated: ExplorationPersonality;
  savedAt: string;
  officialStatus: "live" | "fallback";
}
