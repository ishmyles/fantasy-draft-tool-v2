import { type HeaderProps } from "./Header.d";
import { Icon } from "../Icon/Icon";
import { useAppDispatch } from "../../store/hooks";
import { undoLastPick, resetDraft } from "../../store/draftSlice";

export const Header = ({
  sidepanelState: { isSidepanelOpen, setSidePanel },
}: HeaderProps) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className={`tw:flex tw:items-center tw:h-12 tw:p-1 tw:px-3 tw:bg-blue-950 tw:text-white`}
    >
      <button
        className="tw:flex tw:justify-center tw:items-center tw:w-8 tw:h-8 tw:hover:bg-blue-900 tw:border tw:border-white tw:rounded-sm tw:cursor-pointer"
        onClick={() => setSidePanel((isOpen) => !isOpen)}
      >
        <Icon name={isSidepanelOpen ? "CollapseSidebar" : "ExpandSidebar"} />
      </button>

      {/* Draft Controls */}
      <div className="tw:ml-auto tw:flex tw:items-center tw:gap-4">
        <button 
          className="tw:text-sm tw:font-semibold tw:text-slate-300 tw:hover:text-white tw:transition-colors tw:cursor-pointer"
          onClick={() => dispatch(undoLastPick())}
        >
          Undo Pick
        </button>
        <button 
          className="tw:text-sm tw:font-semibold tw:px-3 tw:py-1.5 tw:bg-red-500 tw:hover:bg-red-600 tw:text-white tw:rounded tw:transition-colors tw:cursor-pointer"
          onClick={() => dispatch(resetDraft())}
        >
          Reset Draft
        </button>
      </div>
    </div>
  );
};
