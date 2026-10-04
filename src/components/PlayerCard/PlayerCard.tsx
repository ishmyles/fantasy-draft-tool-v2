import React from "react";
import type { Player } from "../../types/player";
import { Icon } from "../Icon/Icon";
import { useAppDispatch } from "../../store/hooks";
import { draftPlayer, markUnavailable } from "../../store/draftSlice";

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const dispatch = useAppDispatch();
  const stats = player.statsPrediction;

  // Calculate missing stats
  const fgm = stats.fieldGoalsMade || 0;
  const fga = stats.fieldGoalPct ? fgm / stats.fieldGoalPct : 0;
  const ftm = stats.pointsPerGame - 2 * fgm - stats.threePointersMade;
  const fta = stats.freeThrowPct ? ftm / stats.freeThrowPct : 0;

  const formatNum = (num: number, decimals: number = 1) =>
    num.toFixed(decimals);
  const formatPct = (num: number) => num.toFixed(3).replace(/^0+/, "");

  return (
    <div className="tw:flex tw:items-center tw:px-4 tw:py-3 tw:bg-white tw:border tw:border-gray-100 tw:rounded-xl tw:mb-2 tw:shadow-sm tw:min-w-max">
      {/* Rank */}
      <div className="tw:shrink-0 tw:font-bold tw:text-slate-700 tw:bg-slate-100 tw:rounded-full tw:h-8 tw:w-8 tw:flex tw:items-center tw:justify-center tw:mr-4">
        {player.rank}
      </div>

      {/* Player Info */}
      <div className="tw:w-64 tw:shrink-0 tw:flex tw:items-center tw:gap-3 tw:mr-4">
        <div className="tw:h-10 tw:w-10 tw:bg-gray-200 tw:rounded-full tw:overflow-hidden tw:shrink-0">
          {/* Placeholder for player image */}
          <img
            src={`https://ui-avatars.com/api/?name=${player.name.replace(" ", "+")}&background=random`}
            alt={player.name}
          />
        </div>
        <div className="tw:flex tw:flex-col">
          <div className="tw:font-bold tw:text-slate-800 tw:truncate">
            {player.name}
          </div>
          <div className="tw:text-xs tw:text-slate-500 tw:text-start">
            {player.team} • {player.position.join(", ")}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="tw:w-10 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {stats.gamesPlayed}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatNum(fgm)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatNum(fga)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatPct(stats.fieldGoalPct)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatNum(ftm)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatNum(fta)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatPct(stats.freeThrowPct)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatNum(stats.threePointersMade)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatNum(stats.reboundsPerGame)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatNum(stats.assistsPerGame)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatNum(stats.stealsPerGame)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatNum(stats.blocksPerGame)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:text-slate-600">
        {formatNum(stats.turnoversPerGame)}
      </div>
      <div className="tw:w-12 tw:shrink-0 tw:text-sm tw:font-bold tw:text-slate-800">
        {formatNum(stats.pointsPerGame)}
      </div>

      {/* Action */}
      <div className="tw:ml-auto tw:pl-4 tw:flex tw:items-center tw:gap-2">
        <button 
          className="tw:border-2 tw:text-slate-400 tw:hover:text-red-500 tw:transition-colors tw:cursor-pointer tw:p-1 tw:rounded-full tw:hover:bg-red-50 tw:flex tw:items-center tw:justify-center"
          onClick={() => dispatch(markUnavailable(player.id))}
        >
          <Icon name="Close" size={20} />
        </button>
        <button 
          className="tw:border-2 tw:border-orange-400 tw:text-orange-500 tw:font-bold tw:px-6 tw:py-1 tw:rounded-full tw:hover:bg-orange-50 tw:transition-colors tw:cursor-pointer"
          onClick={() => dispatch(draftPlayer(player.id))}
        >
          Draft
        </button>
      </div>
    </div>
  );
};
