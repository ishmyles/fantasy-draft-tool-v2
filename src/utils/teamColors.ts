export interface TeamColors {
  primary: string;   // Jersey inner color
  secondary: string; // Jersey outline / trim color
}

export const NBA_TEAM_COLORS: Record<string, TeamColors> = {
  "76ers": { primary: "#006BB6", secondary: "#ED174C" },
  "Bucks": { primary: "#00471B", secondary: "#EEE1C6" },
  "Bulls": { primary: "#CE1141", secondary: "#FFFFFF" },
  "Cavaliers": { primary: "#860038", secondary: "#FDBB30" },
  "Celtics": { primary: "#007A33", secondary: "#BA9653" },
  "Clippers": { primary: "#C8102E", secondary: "#1D428A" },
  "Grizzlies": { primary: "#5D76A9", secondary: "#12173F" },
  "Hawks": { primary: "#E03A3E", secondary: "#C1D32F" },
  "Heat": { primary: "#000000", secondary: "#98002E" },
  "Hornets": { primary: "#1D1160", secondary: "#00788C" },
  "Jazz": { primary: "#002B5C", secondary: "#F9A01B" },
  "Kings": { primary: "#5A2D81", secondary: "#63727A" },
  "Knicks": { primary: "#006BB6", secondary: "#F58426" },
  "Lakers": { primary: "#552583", secondary: "#FDB927" },
  "Magic": { primary: "#0077C0", secondary: "#C4CED4" },
  "Mavericks": { primary: "#00538C", secondary: "#B8C4CA" },
  "Nets": { primary: "#111827", secondary: "#FFFFFF" },
  "Nuggets": { primary: "#0E2240", secondary: "#FEC524" },
  "Pacers": { primary: "#002D62", secondary: "#FDBB30" },
  "Pelicans": { primary: "#002B5C", secondary: "#C1A875" },
  "Pistons": { primary: "#1D42BA", secondary: "#C8102E" },
  "Raptors": { primary: "#CE1141", secondary: "#000000" },
  "Rockets": { primary: "#CE1141", secondary: "#FFC72C" },
  "Spurs": { primary: "#111827", secondary: "#C4CED4" },
  "Suns": { primary: "#1D1160", secondary: "#E56020" },
  "Thunder": { primary: "#007AC1", secondary: "#EF3B24" },
  "Timberwolves": { primary: "#0C2340", secondary: "#236192" },
  "Trail Blazers": { primary: "#E03A3E", secondary: "#000000" },
  "Warriors": { primary: "#1D428A", secondary: "#FFC72C" },
  "Wizards": { primary: "#002B5C", secondary: "#E31837" },
  "FA": { primary: "#475569", secondary: "#94A3B8" },
};

export const DEFAULT_TEAM_COLORS: TeamColors = {
  primary: "#334155",
  secondary: "#94A3B8",
};

export function getTeamColors(teamName?: string): TeamColors {
  if (!teamName || !NBA_TEAM_COLORS[teamName]) {
    return DEFAULT_TEAM_COLORS;
  }
  return NBA_TEAM_COLORS[teamName];
}

