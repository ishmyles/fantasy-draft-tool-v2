export interface PlayerStats {
  gamesPlayed: number;
  minutesPerGame: number;
  fieldGoalPct: number;
  freeThrowPct: number;
  threePointersMade: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  assistToTurnoverRatio: number;
  stealsPerGame: number;
  blocksPerGame: number;
  turnoversPerGame: number;
  pointsPerGame: number;
  fieldGoalsMade: number;
}

export interface Player {
  id: number;
  rank: number;
  name: string;
  team: string;
  position: string[];
  statsLastSeason: PlayerStats;
  statsPrediction: PlayerStats;
  playerOutlook: string;
}

