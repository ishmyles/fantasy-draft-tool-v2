import React, { useMemo, useRef } from "react";
import { useAppSelector } from "../../store/hooks";
import { PlayerCard } from "../PlayerCard/PlayerCard";
import { useVirtualizer } from "@tanstack/react-virtual";

export const PlayerList: React.FC = () => {
  const availablePlayers = useAppSelector(
    (state) => state.draft.availablePlayers,
  );
  const filters = useAppSelector((state) => state.draft.filters);

  const filteredPlayers = useMemo(() => {
    return availablePlayers.filter((player) => {
      if (
        filters.search &&
        !player.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.team !== "All Teams" && player.team !== filters.team)
        return false;

      if (filters.position !== "All") {
        let validPositions = [filters.position];
        if (filters.position === "G") validPositions = ["PG", "SG", "G"];
        if (filters.position === "F") validPositions = ["SF", "PF", "F"];

        const hasPositionMatch = player.position.some((p) =>
          validPositions.includes(p),
        );
        if (!hasPositionMatch) return false;
      }

      return true;
    });
  }, [availablePlayers, filters]);

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredPlayers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Rough pixel height of a PlayerCard
    overscan: 5,
    getItemKey: (index) => filteredPlayers[index]?.id ?? index,
  });

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
    <div className="tw:flex tw:flex-col tw:flex-1 tw:min-h-0 tw:bg-slate-50 tw:p-4 tw:py-1">
      {/* Single Scroll Container for both X and Y */}
      <div
        ref={parentRef}
        className="tw:flex-1 tw:min-h-0 tw:overflow-auto tw:pr-2"
      >
        <div className="tw:min-w-max tw:flex tw:flex-col">
          {/* Sticky Header Row */}
          <div className="tw:sticky tw:top-0 tw:z-20 tw:bg-slate-50 tw:flex tw:items-center tw:px-3 tw:py-2.5 tw:text-xs tw:font-bold tw:text-slate-400 tw:uppercase tw:border-b tw:border-slate-200/60">
            <div className="tw:w-10 tw:shrink-0 tw:mr-2">#</div>
            <div className="tw:w-80 tw:shrink-0">Player</div>
            <div className="tw:flex tw:items-center tw:mx-auto">
              <div className="tw:w-10 tw:shrink-0">{headers[0]}</div>
              {headers.slice(1).map((header) => (
                <div key={header} className="tw:w-12 tw:shrink-0">
                  {header}
                </div>
              ))}
            </div>
          </div>

          {/* Virtualizer Body */}
          <div
            className="tw:pt-1.5"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const player = filteredPlayers[virtualItem.index];
              if (!player) return null;
              return (
                <div
                  key={virtualItem.key}
                  className="tw:pb-2"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <PlayerCard player={player} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
