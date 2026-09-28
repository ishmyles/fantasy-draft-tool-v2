import { type HeaderProps } from "./Header.d"
import { Icon } from "../Icon/Icon"

export const Header = ({ sidepanelState: { isSidepanelOpen, setSidePanel } }: HeaderProps) => {

    return (
        <div className={`tw:flex tw:items-center tw:h-12 tw:p-1 tw:bg-blue-950 tw:text-white`}>
            <button 
                className='tw:flex tw:justify-center tw:items-center tw:w-8 tw:h-8 tw:hover:bg-blue-900 tw:border tw:border-white tw:rounded-sm tw:cursor-pointer'
                onClick={() => setSidePanel(isOpen => !isOpen)}
            >
                <Icon name={isSidepanelOpen ? "CollapseSidebar" : "ExpandSidebar"} />
            </button>
        </div>
    )
}
