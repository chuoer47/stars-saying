import type { ExplorationMemoryEntry } from "@/types/exploration";

export const explorationMemoryStorageKey = "stars-saying-exploration-memory";
const maxMemoryEntries = 30;

export function loadExplorationMemory() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(explorationMemoryStorageKey);
    const parsed = saved ? (JSON.parse(saved) as ExplorationMemoryEntry[]) : [];

    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.id === "string" && typeof item.name === "string")
      : [];
  } catch {
    return [];
  }
}

export function saveExplorationMemory(entries: ExplorationMemoryEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    explorationMemoryStorageKey,
    JSON.stringify(entries.slice(0, maxMemoryEntries)),
  );
}

export function upsertExplorationMemory(entry: ExplorationMemoryEntry) {
  const current = loadExplorationMemory();
  const next = [
    {
      ...entry,
      savedAt: new Date().toISOString(),
    },
    ...current.filter((item) => item.id !== entry.id),
  ].slice(0, maxMemoryEntries);

  saveExplorationMemory(next);
  return next;
}
