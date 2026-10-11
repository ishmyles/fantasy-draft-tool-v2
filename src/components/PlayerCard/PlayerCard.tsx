import React from "react";
import type { Player } from "../../types/player";
import { Icon } from "../Icon/Icon";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  draftPlayer,
  markUnavailable,
  toggleWishlist,
} from "../../store/draftSlice";

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.draft.wishlist);
  const isWishlisted = wishlist.some((p) => p.id === player.id);
  const stats = player.statsPrediction;

  // Calculate missing stats
  const fgm = stats.fieldGoalsMade || 0;
  const fga = stats.fieldGoalAttempts || 0;
  const ftm = stats.pointsPerGame - 2 * fgm - stats.threePointersMade;
  const fta = stats.freeThrowPct ? ftm / stats.freeThrowPct : 0;

  const formatNum = (num: number, decimals: number = 1) =>
    num.toFixed(decimals);
  const formatPct = (num: number) => num.toFixed(3).replace(/^0+/, "");

  return (
    <div className="tw:flex tw:items-center tw:px-3 tw:py-3 tw:bg-white tw:border tw:border-gray-100 tw:rounded-xl tw:shadow-sm tw:min-w-max tw:h-full">
      {/* Rank */}
      <div className="tw:shrink-0 tw:font-bold tw:text-slate-700 tw:tabular-nums tw:w-10 tw:mr-2">
        {player.rank}
      </div>

      {/* Player Info & Actions Column */}
      <div className="tw:w-80 tw:shrink-0 tw:flex tw:items-center tw:justify-between">
        {/* Child 1: Avatar and Name */}
        <div
          className="tw:flex tw:items-center tw:gap-3 tw:overflow-hidden tw:cursor-pointer tw:group tw:flex-1 tw:min-w-0 tw:mr-2"
          onClick={() => dispatch(toggleWishlist(player.id))}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <div className="tw:h-10 tw:w-10 tw:bg-slate-100 tw:rounded-full tw:overflow-hidden tw:shrink-0 tw:flex tw:items-center tw:justify-center">
            <Icon
              name="PlayerSilhouette"
              size={40}
              team={player.team}
            />
          </div>
          <div className="tw:flex tw:flex-col tw:text-start tw:overflow-hidden tw:flex-1 tw:min-w-0">
            <div className="tw:flex tw:items-center tw:justify-between tw:gap-1 tw:min-w-0">
              <span className="tw:font-bold tw:text-slate-800 tw:truncate group-hover:tw:text-orange-500 tw:transition-colors">
                {player.name}
              </span>
              {isWishlisted && (
                <div className="tw:shrink-0 tw:ml-1">
                  <Icon name="Star" size={14} fill="#f97316" stroke="#f97316" />
                </div>
              )}
            </div>
            <div className="tw:text-xs tw:text-slate-500 tw:truncate">
              {player.team} • {player.position.join(", ")}
            </div>
          </div>
        </div>

        {/* Child 2: Action Buttons */}
        <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0 tw:ml-2">
          <button
            className="tw:border-2 tw:text-slate-400 tw:hover:text-red-500 tw:transition-colors tw:cursor-pointer tw:p-1 tw:rounded-full tw:hover:bg-red-50 tw:flex tw:items-center tw:justify-center"
            onClick={() => dispatch(markUnavailable(player.id))}
          >
            <Icon name="Close" size={16} />
          </button>
          <button
            className="tw:border-2 tw:border-orange-400 tw:text-orange-500 tw:font-bold tw:px-4 tw:py-1 tw:rounded-full tw:hover:bg-orange-50 tw:transition-colors tw:cursor-pointer tw:text-sm"
            onClick={() => dispatch(draftPlayer(player.id))}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="tw:flex tw:items-center tw:mx-auto">
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
      </div>
    </div>
  );
};
