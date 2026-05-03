export type CelestialCategory =
  | "solar-system"
  | "star"
  | "constellation"
  | "minor-body"
  | "deep-space"
  | "exoplanet";

export interface CelestialBody {
  id: string;
  name: string;
  type: string;
  category: CelestialCategory;
  avatar: string;
  tagline: string;
  personality: string;
  tone: string;
  tags: string[];
  suggestedQuestions: string[];
  priority: number;
  featured?: boolean;
  englishName?: string;
  nasaQuery?: string;
  horizonsId?: string;
  exoplanetName?: string;
}
