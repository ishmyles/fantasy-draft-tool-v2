import React, { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import type { Player } from "../../types/player";
import { Icon } from "../Icon/Icon";

export const DraftBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"roster" | "history">("roster");
  const players = useAppSelector((state) => state.player.playerList);

  // Mock: first 10 players as drafted roster / pick history
  const mockRoster = players.slice(0, 10);
  const mockHistory = players.slice(0, 10);

  return (
    <div className="tw:flex tw:flex-col tw:h-full tw:w-full tw:min-w-0">
      {/* Tab Bar */}
      <div className="tw:flex tw:border-b tw:border-gray-200">
        <button
          className={`tw:flex-1 tw:flex tw:items-center tw:justify-center tw:gap-2 tw:py-3 tw:px-4 tw:text-sm tw:font-bold tw:uppercase tw:cursor-pointer tw:transition-colors tw:border-b-2 ${
            activeTab === "roster"
              ? "tw:border-orange-500 tw:text-orange-500"
              : "tw:border-transparent tw:text-slate-400 tw:hover:text-slate-600"
          }`}
          onClick={() => setActiveTab("roster")}
        >
          <Icon
            name="Roster"
            size={18}
            stroke={activeTab === "roster" ? "#f97316" : "currentColor"}
          />
          Roster
        </button>
        <button
          className={`tw:flex-1 tw:flex tw:items-center tw:justify-center tw:gap-2 tw:py-3 tw:px-4 tw:text-sm tw:font-bold tw:uppercase tw:cursor-pointer tw:transition-colors tw:border-b-2 ${
            activeTab === "history"
              ? "tw:border-orange-500 tw:text-orange-500"
              : "tw:border-transparent tw:text-slate-400 tw:hover:text-slate-600"
          }`}
          onClick={() => setActiveTab("history")}
        >
          <Icon
            name="History"
            size={18}
            stroke={activeTab === "history" ? "#f97316" : "currentColor"}
          />
          Pick History
        </button>
      </div>

      {/* Content */}
      {activeTab === "roster" ? (
        <RosterView players={mockRoster} />
      ) : (
        <HistoryView players={mockHistory} />
      )}
    </div>
  );
};

/* ── Roster View ─────────────────────────────────── */

const STAT_HEADERS = [
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

const RosterView: React.FC<{ players: Player[] }> = ({ players }) => {
  return (
    <div className="tw:flex tw:flex-col tw:flex-1 tw:min-h-0 tw:w-full tw:min-w-0">
      {/* Header */}
      <div className="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3 tw:shrink-0">
        <div className="tw:flex tw:items-center tw:gap-2">
          <Icon name="Roster" size={20} stroke="#334155" />
          <span className="tw:font-bold tw:text-slate-800">My Roster</span>
        </div>
        <span className="tw:text-sm tw:text-slate-400 tw:font-semibold">
          {players.length}/16
        </span>
      </div>

      {/* Scrollable Container */}
      <div className="tw:flex-1 tw:overflow-auto tw:min-h-0">
        {/* Sticky Header Row */}
        <div className="tw:sticky tw:top-0 tw:z-20 tw:flex tw:items-center tw:bg-slate-50 tw:border-b tw:border-gray-200 tw:min-w-max">
          {/* Sticky Player Column Header */}
          <div className="tw:sticky tw:left-0 tw:z-30 tw:bg-slate-50 tw:px-4 tw:py-2 tw:w-40 tw:shrink-0 tw:text-[10px] tw:font-semibold tw:text-slate-400 tw:uppercase tw:text-left">
            Player
          </div>
          {/* Stats Headers */}
          {STAT_HEADERS.map((header) => (
            <div
              key={header}
              className="tw:w-12 tw:shrink-0 tw:text-center tw:text-[10px] tw:font-semibold tw:text-slate-400 tw:uppercase"
            >
              {header}
            </div>
          ))}
        </div>

        {/* Player Rows */}
        <div className="tw:min-w-max tw:pb-2">
          {players.map((player) => {
            const stats = player.statsPrediction;
            const fgm = stats.fieldGoalsMade || 0;
            const fga = stats.fieldGoalPct ? fgm / stats.fieldGoalPct : 0;
            const ftm = stats.pointsPerGame - 2 * fgm - stats.threePointersMade;
            const fta = stats.freeThrowPct ? ftm / stats.freeThrowPct : 0;

            const formatNum = (num: number, decimals: number = 1) =>
              num.toFixed(decimals);
            const formatPct = (num: number) =>
              num.toFixed(3).replace(/^0+/, "");

            return (
              <div
                key={player.id}
                className="tw:flex tw:items-center tw:border-b tw:border-gray-100 tw:hover:bg-slate-50 tw:group tw:transition-colors"
              >
                {/* Sticky Player Info Column */}
                <div className="tw:sticky tw:left-0 tw:z-10 tw:bg-white group-hover:tw:bg-slate-50 tw:flex tw:flex-col tw:w-40 tw:shrink-0 tw:px-4 tw:py-1 tw:text-left tw:border-r tw:border-transparent tw:transition-colors">
                  <span className="tw:font-bold tw:text-slate-800 tw:text-xs tw:truncate">
                    {player.name}
                  </span>
                  <span className="tw:text-[11px] tw:text-slate-500">
                    {player.team} - {player.position.join(", ")}
                  </span>
                </div>

                {/* Stats Columns */}
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {stats.gamesPlayed}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatNum(fgm)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatNum(fga)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatPct(stats.fieldGoalPct)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatNum(ftm)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatNum(fta)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatPct(stats.freeThrowPct)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatNum(stats.threePointersMade)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatNum(stats.reboundsPerGame)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatNum(stats.assistsPerGame)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatNum(stats.stealsPerGame)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatNum(stats.blocksPerGame)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:text-slate-600">
                  {formatNum(stats.turnoversPerGame)}
                </div>
                <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                  {formatNum(stats.pointsPerGame)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ── Pick History View ───────────────────────────── */

const HistoryView: React.FC<{ players: Player[] }> = ({ players }) => {
  return (
    <div className="tw:flex tw:flex-col tw:flex-1 tw:min-h-0">
      {/* Header */}
      <div className="tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-3">
        <Icon name="History" size={20} stroke="#334155" />
        <span className="tw:font-bold tw:text-slate-800">Pick History</span>
      </div>

      {/* Pick List */}
      <div className="tw:flex-1 tw:overflow-y-auto tw:min-h-0">
        {players.map((player, index) => (
          <div
            key={player.id}
            className="tw:flex tw:flex-col tw:px-4 tw:py-1 tw:border-b tw:border-gray-100 tw:hover:bg-slate-50 tw:transition-colors tw:text-left"
          >
            {/* Round & Pick */}
            <span className="tw:text-[10px] tw:font-semibold tw:text-slate-400 tw:uppercase tw:mb-0.5">
              Rd {Math.floor(index / 10) + 1}, Pick {index + 1}
            </span>

            {/* Player Info */}
            <div className="tw:flex tw:flex-col tw:min-w-0">
              <span className="tw:font-bold tw:text-slate-800 tw:text-xs tw:truncate">
                {player.name}
              </span>
              <span className="tw:text-[11px] tw:text-slate-500">
                {player.team} - {player.position.join(", ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
