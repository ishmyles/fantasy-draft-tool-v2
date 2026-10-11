import type { Player } from "../types/player";

const STORAGE_KEY = "fantasy_draft_tool_v2_state";

export interface PersistedDraftData {
  rosterIds: string[];
  historyIds: string[];
  wishlistIds: string[];
}

export function loadSavedDraftData(): PersistedDraftData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed.rosterIds) &&
      Array.isArray(parsed.historyIds) &&
      Array.isArray(parsed.wishlistIds)
    ) {
      return parsed;
    }
  } catch (err) {
    console.warn("Failed to load draft data from localStorage:", err);
  }
  return null;
}

export function saveDraftData(data: PersistedDraftData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Failed to save draft data to localStorage:", err);
  }
}

export function clearDraftData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear draft data from localStorage:", err);
  }
}

export function getInitialDraftState(defaultPlayers: Player[]) {
  const saved = loadSavedDraftData();
  if (!saved) {
    return {
      availablePlayers: [...defaultPlayers],
      myRoster: [] as Player[],
      pickHistory: [] as Player[],
      wishlist: [] as Player[],
    };
  }

  const playerMap = new Map<string, Player>(defaultPlayers.map((p) => [p.id, p]));
  const pickedIds = new Set(saved.historyIds);

  const myRoster = saved.rosterIds
    .map((id) => playerMap.get(id))
    .filter((p): p is Player => p !== undefined);

  const pickHistory = saved.historyIds
    .map((id) => playerMap.get(id))
    .filter((p): p is Player => p !== undefined);

  const wishlist = saved.wishlistIds
    .map((id) => playerMap.get(id))
    .filter((p): p is Player => p !== undefined);

  const availablePlayers = defaultPlayers.filter((p) => !pickedIds.has(p.id));

  return {
    availablePlayers,
    myRoster,
    pickHistory,
    wishlist,
  };
}

