import { useState, useMemo } from "react";
import type { Player } from "../types/player";

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
  key: string | null;
  direction: SortDirection;
}

/**
 * Extracts a numeric value or comparable string from a Player object for sorting.
 */
export const getPlayerStatValue = (player: Player, key: string): number => {
  const stats = player.statsPrediction;
  if (!stats) return 0;

  switch (key) {
    case "#":
    case "RANK":
      return player.rank ?? 9999;
    case "GP":
      return stats.gamesPlayed ?? 0;
    case "FGM":
      return stats.fieldGoalsMade ?? 0;
    case "FGA":
      return stats.fieldGoalAttempts ?? 0;
    case "FG%":
      return stats.fieldGoalPct ?? 0;
    case "FTM": {
      const fgm = stats.fieldGoalsMade ?? 0;
      return stats.pointsPerGame - 2 * fgm - (stats.threePointersMade ?? 0);
    }
    case "FTA": {
      const fgm = stats.fieldGoalsMade ?? 0;
      const ftm = stats.pointsPerGame - 2 * fgm - (stats.threePointersMade ?? 0);
      return stats.freeThrowPct ? ftm / stats.freeThrowPct : 0;
    }
    case "FT%":
      return stats.freeThrowPct ?? 0;
    case "3PM":
      return stats.threePointersMade ?? 0;
    case "REB":
      return stats.reboundsPerGame ?? 0;
    case "AST":
      return stats.assistsPerGame ?? 0;
    case "STL":
      return stats.stealsPerGame ?? 0;
    case "BLK":
      return stats.blocksPerGame ?? 0;
    case "TO":
      return stats.turnoversPerGame ?? 0;
    case "PTS":
      return stats.pointsPerGame ?? 0;
    default:
      return 0;
  }
};

/**
 * Determines whether a column naturally defaults to Ascending on first click.
 * - Rank (#) starts Ascending (rank 1 is top).
 * - "Player" starts Ascending (A-Z).
 * - All stats (including TO, PTS, REB, AST, etc.) start Descending (highest numbers first).
 */
const getInitialDirection = (key: string): "asc" | "desc" => {
  if (key === "#" || key === "RANK" || key === "Player") {
    return "asc";
  }
  return "desc";
};

/**
 * Reusable hook providing 3-state column sorting across all player table types.
 */
export const usePlayerSort = (
  players: Player[],
  defaultKey: string | null = null,
  defaultDirection: SortDirection = null,
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: defaultKey,
    direction: defaultDirection,
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      // If clicking a new column, start with its initial natural direction
      if (prev.key !== key) {
        return { key, direction: getInitialDirection(key) };
      }

      // If clicking the active column, cycle through: initial -> opposite -> reset (null)
      const initial = getInitialDirection(key);
      if (initial === "asc") {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
        return { key, direction: "asc" };
      } else {
        if (prev.direction === "desc") return { key, direction: "asc" };
        if (prev.direction === "asc") return { key: null, direction: null };
        return { key, direction: "desc" };
      }
    });
  };

  const sortedPlayers = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return players;
    }

    const { key, direction } = sortConfig;

    return [...players].sort((a, b) => {
      if (key === "Player") {
        const comp = a.name.localeCompare(b.name);
        return direction === "asc" ? comp : -comp;
      }

      const valA = getPlayerStatValue(a, key);
      const valB = getPlayerStatValue(b, key);

      if (valA === valB) {
        // Deterministic secondary tiebreaker: overall rank
        return (a.rank ?? 9999) - (b.rank ?? 9999);
      }

      return direction === "asc" ? valA - valB : valB - valA;
    });
  }, [players, sortConfig]);

  return { sortedPlayers, sortConfig, handleSort };
};

