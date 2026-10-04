import React from "react";
import { useAppSelector } from "../../store/hooks";
import { PlayerCard } from "../PlayerCard/PlayerCard";

export const PlayerList: React.FC = () => {
  const players = useAppSelector((state) => state.player.playerList);

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
    <div className="tw:flex tw:flex-col tw:h-full tw:bg-slate-50 tw:p-4">
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
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
};
