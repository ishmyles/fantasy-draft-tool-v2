import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setSearch, setTeamFilter, setPositionFilter, clearFilters } from "../../store/draftSlice";

const POSITIONS = ["All", "PG", "SG", "SF", "PF", "C", "G", "F"];

export const FilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { search, team, position } = useAppSelector((state) => state.draft.filters);
  const allPlayers = useAppSelector((state) => state.draft.availablePlayers);

  // Dynamically extract unique teams and sort them alphabetically
  const uniqueTeams = useMemo(() => {
    const teams = new Set(allPlayers.map((p) => p.team));
    return ["All Teams", ...Array.from(teams).sort()];
  }, [allPlayers]);

  return (
    <div className="tw:flex tw:flex-col tw:gap-4 tw:p-4 tw:bg-white tw:border-b tw:border-gray-200">
      {/* Top Row: Title, Dropdown, Search, Clear */}
      <div className="tw:flex tw:items-center tw:gap-4">
        <h2 className="tw:text-xl tw:font-bold tw:text-slate-900 tw:mr-auto">Players</h2>
        
        <select 
          className="tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 tw:text-sm tw:font-semibold tw:text-slate-700 tw:outline-none"
          value={team}
          onChange={(e) => dispatch(setTeamFilter(e.target.value))}
        >
          {uniqueTeams.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <div className="tw:relative tw:w-64">
          <svg className="tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Search Player..." 
            className="tw:w-full tw:border tw:border-gray-300 tw:rounded tw:pl-9 tw:pr-3 tw:py-2 tw:text-sm tw:outline-none"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
        </div>

        <button 
          className="tw:bg-slate-700 tw:hover:bg-slate-800 tw:text-white tw:px-5 tw:py-2 tw:rounded tw:text-sm tw:font-bold tw:transition-colors tw:cursor-pointer"
          onClick={() => dispatch(clearFilters())}
        >
          Clear
        </button>
      </div>

      {/* Bottom Row: Position Pills */}
      <div className="tw:flex tw:items-center tw:gap-2">
        {POSITIONS.map(pos => (
          <button
            key={pos}
            className={`tw:px-4 tw:py-1.5 tw:rounded-full tw:text-sm tw:font-bold tw:border tw:transition-colors tw:cursor-pointer ${
              position === pos 
                ? "tw:bg-slate-800 tw:text-white tw:border-slate-800" 
                : "tw:bg-white tw:text-slate-600 tw:border-gray-200 tw:hover:bg-slate-50"
            }`}
            onClick={() => dispatch(setPositionFilter(pos))}
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  );
};
