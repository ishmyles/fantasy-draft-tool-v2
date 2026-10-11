import React, { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { toggleWishlist } from "../../store/draftSlice";
import type { Player } from "../../types/player";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/icon.d";
import { usePlayerSort } from "../../hooks/usePlayerSort";

export const DraftBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"roster" | "wishlist" | "history">(
    "roster",
  );
  const myRoster = useAppSelector((state) => state.draft.myRoster);
  const pickHistory = useAppSelector((state) => state.draft.pickHistory);
  const wishlist = useAppSelector((state) => state.draft.wishlist);

  return (
    <div className="tw:flex tw:flex-col tw:h-full tw:w-full tw:min-w-0 tw:pt-2">
      {/* Tab Bar */}
      <div className="tw:flex tw:border-b tw:border-gray-200">
        <button
          className={`tw:flex-1 tw:flex tw:items-center tw:justify-center tw:gap-2 tw:py-4 tw:px-2 tw:text-sm tw:font-bold tw:uppercase tw:cursor-pointer tw:transition-colors tw:border-b-2 ${
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
          className={`tw:flex-1 tw:flex tw:items-center tw:justify-center tw:gap-2 tw:py-4 tw:px-2 tw:text-sm tw:font-bold tw:uppercase tw:cursor-pointer tw:transition-colors tw:border-b-2 ${
            activeTab === "wishlist"
              ? "tw:border-orange-500 tw:text-orange-500"
              : "tw:border-transparent tw:text-slate-400 tw:hover:text-slate-600"
          }`}
          onClick={() => setActiveTab("wishlist")}
        >
          <Icon
            name="Star"
            size={18}
            stroke={activeTab === "wishlist" ? "#f97316" : "currentColor"}
            fill={activeTab === "wishlist" ? "#f97316" : "none"}
          />
          Wishlist
        </button>
        <button
          className={`tw:flex-1 tw:flex tw:items-center tw:justify-center tw:gap-2 tw:py-4 tw:px-2 tw:text-sm tw:font-bold tw:uppercase tw:cursor-pointer tw:transition-colors tw:border-b-2 ${
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
          History
        </button>
      </div>

      {/* Content */}
      {activeTab === "roster" && <RosterView players={myRoster} />}
      {activeTab === "wishlist" && <WishlistView players={wishlist} />}
      {activeTab === "history" && <HistoryView players={pickHistory} />}
    </div>
  );
};

/* ── Reusable Player Stats Table ─────────────────── */

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

interface PlayerStatsTableProps {
  players: Player[];
  showAverages: boolean;
  title: string;
  icon: IconName;
  onRemovePlayer?: (playerId: string) => void;
}

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({
  players,
  showAverages,
  title,
  icon,
  onRemovePlayer,
}) => {
  const totals = useMemo(() => {
    return players.reduce(
      (acc, p) => {
        const s = p.statsPrediction;
        const fgm = s.fieldGoalsMade || 0;
        const fga = s.fieldGoalAttempts || 0;
        const ftm = s.pointsPerGame - 2 * fgm - s.threePointersMade;
        const fta = s.freeThrowPct ? ftm / s.freeThrowPct : 0;

        acc.gp += s.gamesPlayed || 0;
        acc.fgm += fgm;
        acc.fga += fga;
        acc.ftm += ftm;
        acc.fta += fta;
        acc.tpm += s.threePointersMade || 0;
        acc.reb += s.reboundsPerGame || 0;
        acc.ast += s.assistsPerGame || 0;
        acc.stl += s.stealsPerGame || 0;
        acc.blk += s.blocksPerGame || 0;
        acc.to += s.turnoversPerGame || 0;
        acc.pts += s.pointsPerGame || 0;
        return acc;
      },
      {
        gp: 0,
        fgm: 0,
        fga: 0,
        ftm: 0,
        fta: 0,
        tpm: 0,
        reb: 0,
        ast: 0,
        stl: 0,
        blk: 0,
        to: 0,
        pts: 0,
      },
    );
  }, [players]);

  const n = players.length || 1;
  const avgFGPct = totals.fga > 0 ? totals.fgm / totals.fga : 0;
  const avgFTPct = totals.fta > 0 ? totals.ftm / totals.fta : 0;

  const formatNum = (num: number, decimals: number = 1) =>
    num.toFixed(decimals);
  const formatPct = (num: number) => num.toFixed(3).replace(/^0+/, "");

  const { sortedPlayers, sortConfig, handleSort } = usePlayerSort(players);

  return (
    <div className="tw:flex tw:flex-col tw:flex-1 tw:min-h-0 tw:w-full tw:min-w-0">
      {/* Header */}
      <div className="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-4 tw:pb-4.5 tw:shrink-0">
        <div className="tw:flex tw:items-center tw:gap-2">
          <Icon name={icon} size={20} stroke="#334155" />
          <span className="tw:font-bold tw:text-slate-800">{title}</span>
        </div>
        <span className="tw:text-sm tw:text-slate-400 tw:font-semibold">
          {players.length}
          {title === "My Roster" ? "/14" : ""}
        </span>
      </div>

      {/* Single Scrollable Container for both X and Y */}
      <div className="tw:flex-1 tw:overflow-auto tw:min-h-0 tw:relative">
        <div className="tw:min-w-max tw:flex tw:flex-col tw:min-h-full">
          {/* Sticky Header Row */}
          <div className="tw:sticky tw:top-0 tw:z-20 tw:flex tw:items-center tw:bg-slate-50 tw:border-y tw:border-slate-200/60 tw:shrink-0">
            {/* Sticky Player Column Header */}
            <button
              onClick={() => handleSort("Player")}
              className={`tw:sticky tw:left-0 tw:z-30 tw:bg-slate-50 tw:px-4 tw:py-2 tw:w-48 tw:shrink-0 tw:flex tw:items-center tw:gap-1 hover:tw:text-slate-700 tw:cursor-pointer tw:transition-colors tw:text-[10px] tw:font-semibold tw:uppercase tw:text-left ${
                sortConfig.key === "Player" ? "tw:text-orange-500" : "tw:text-slate-400"
              }`}
              title="Sort by Player Name"
            >
              <span>Player</span>
              {sortConfig.key === "Player" && (
                <span className="tw:text-[8px]">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              )}
            </button>
            {/* Stats Headers */}
            {STAT_HEADERS.map((header) => (
              <button
                key={header}
                onClick={() => handleSort(header)}
                className={`tw:w-12 tw:shrink-0 tw:flex tw:items-center tw:justify-center tw:gap-0.5 hover:tw:text-slate-700 tw:cursor-pointer tw:transition-colors tw:text-[10px] tw:font-semibold tw:uppercase ${
                  sortConfig.key === header ? "tw:text-orange-500" : "tw:text-slate-400"
                }`}
                title={`Sort by ${header}`}
              >
                <span>{header}</span>
                {sortConfig.key === header && (
                  <span className="tw:text-[8px]">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Player Rows Body */}
          <div className="tw:flex-1 tw:flex tw:flex-col tw:pb-2">
            {sortedPlayers.map((player) => {
              const stats = player.statsPrediction;
              const fgm = stats.fieldGoalsMade || 0;
              const fga = stats.fieldGoalAttempts || 0;
              const ftm =
                stats.pointsPerGame - 2 * fgm - stats.threePointersMade;
              const fta = stats.freeThrowPct ? ftm / stats.freeThrowPct : 0;

              return (
                <div
                  key={player.id}
                  className="tw:flex tw:items-center tw:border-b tw:border-gray-100 tw:hover:bg-slate-50 tw:group tw:transition-colors"
                >
                  {/* Sticky Player Info Column */}
                  <div className="tw:sticky tw:left-0 tw:z-10 tw:bg-white group-hover:tw:bg-slate-50 tw:flex tw:items-center tw:justify-between tw:w-48 tw:shrink-0 tw:px-4 tw:py-1 tw:text-left tw:border-r tw:border-transparent tw:transition-colors">
                    <div className="tw:flex tw:flex-col tw:min-w-0">
                      <span className="tw:font-bold tw:text-slate-800 tw:text-xs tw:truncate">
                        {player.name}
                      </span>
                      <span className="tw:text-[11px] tw:text-slate-500 tw:truncate">
                        {player.team} - {player.position.join(", ")}
                      </span>
                    </div>
                    {onRemovePlayer && (
                      <button
                        onClick={() => onRemovePlayer(player.id)}
                        className="tw:text-slate-400 hover:tw:text-red-500 tw:transition-colors tw:ml-2 tw:shrink-0"
                        title="Remove from Wishlist"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="tw:h-4 tw:w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
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

          {/* Sticky Average Footer */}
          {showAverages && players.length > 0 && (
            <div className="tw:sticky tw:bottom-0 tw:z-20 tw:flex tw:items-center tw:bg-slate-100 tw:border-t tw:border-slate-200/60 tw:shrink-0">
              <div className="tw:sticky tw:left-0 tw:z-30 tw:bg-slate-100 tw:px-4 tw:py-2 tw:w-48 tw:shrink-0 tw:text-[11px] tw:font-bold tw:uppercase tw:text-left tw:border-r tw:border-transparent">
                Average
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.gp / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.fgm / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.fga / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatPct(avgFGPct)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.ftm / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.fta / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatPct(avgFTPct)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.tpm / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.reb / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.ast / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.stl / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.blk / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.to / n)}
              </div>
              <div className="tw:w-12 tw:shrink-0 tw:text-center tw:text-xs tw:font-bold tw:text-slate-800">
                {formatNum(totals.pts / n)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Views ───────────────────────────────────────── */

const RosterView: React.FC<{ players: Player[] }> = ({ players }) => (
  <PlayerStatsTable
    players={players}
    showAverages={true}
    title="My Roster"
    icon="Roster"
  />
);

const WishlistView: React.FC<{ players: Player[] }> = ({ players }) => {
  const dispatch = useAppDispatch();
  return (
    <PlayerStatsTable
      players={players}
      showAverages={false}
      title="Wishlist"
      icon="Star"
      onRemovePlayer={(id) => dispatch(toggleWishlist(id))}
    />
  );
};

/* ── Pick History View ───────────────────────────── */

const HistoryView: React.FC<{ players: Player[] }> = ({ players }) => {
  return (
    <div className="tw:flex tw:flex-col tw:flex-1 tw:min-h-0">
      {/* Header */}
      <div className="tw:flex tw:items-center tw:gap-2 tw:px-4 tw:py-7">
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
