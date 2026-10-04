import React, { useMemo } from "react";
import { useAppSelector } from "../../store/hooks";
import { PlayerCard } from "../PlayerCard/PlayerCard";

export const PlayerList: React.FC = () => {
  const availablePlayers = useAppSelector((state) => state.draft.availablePlayers);
  const filters = useAppSelector((state) => state.draft.filters);

  const filteredPlayers = useMemo(() => {
    return availablePlayers.filter((player) => {
      if (filters.search && !player.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.team !== "All Teams" && player.team !== filters.team) return false;
      
      if (filters.position !== "All") {
        let validPositions = [filters.position];
        if (filters.position === "G") validPositions = ["PG", "SG", "G"];
        if (filters.position === "F") validPositions = ["SF", "PF", "F"];
        
        const hasPositionMatch = player.position.some(p => validPositions.includes(p));
        if (!hasPositionMatch) return false;
      }
      
      return true;
    });
  }, [availablePlayers, filters]);

  const headers = [
    "GP",
    "FGM",
    "FGA",
    "FG%",
    "FTM",
    "FTA",
    "FT%",
    "3PM",
    "REB",
    "AST",
    "STL",
    "BLK",
    "TO",
    "PTS",
  ];

  return (
    <div className="tw:flex tw:flex-col tw:flex-1 tw:min-h-0 tw:bg-slate-50 tw:p-4">
      <div className="tw:overflow-x-auto tw:flex-1 tw:min-h-0 tw:flex tw:flex-col">
        {/* Header Row */}
        <div className="tw:flex tw:items-center tw:px-4 tw:py-3 tw:text-xs tw:font-bold tw:text-slate-400 tw:uppercase tw:mb-2 tw:min-w-max">
          <div className="tw:w-8 tw:shrink-0 tw:mr-4">#</div>
          <div className="tw:w-64 tw:shrink-0 tw:mr-4">Player</div>
          <div className="tw:w-10 tw:shrink-0">{headers[0]}</div>
          {headers.slice(1).map((header) => (
            <div key={header} className="tw:w-12 tw:shrink-0">
              {header}
            </div>
          ))}
          <div className="tw:ml-auto"></div>
        </div>

        {/* Scrollable Body */}
        <div className="tw:flex-1 tw:min-h-0 tw:overflow-y-auto tw:pr-2 tw:min-w-max">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
};
