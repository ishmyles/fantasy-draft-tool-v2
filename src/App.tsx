import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header/Header";
import { PlayerList } from "./components/PlayerList/PlayerList";

const borderString = "tw:border tw:border-black";

function App() {
  const [isSidepanelOpen, setSidePanel] = useState(true);
  return (
    <div className="tw:flex tw:flex-col tw:h-full tw:w-full tw:flex-1 tw:overflow-hidden">
      <Header sidepanelState={{ isSidepanelOpen, setSidePanel }} />
      <div className="tw:flex tw:gap-1 tw:flex-1 tw:p-1 tw:min-h-0 tw:min-w-0">
        {isSidepanelOpen && (
          <div
            className={`${borderString} tw:bg-white tw:min-w-96 tw:h-full tw:rounded-lg`}
          >
            {/* SidePanel */}
          </div>
        )}
        <div
          className={`${borderString} tw:bg-white tw:flex-1 tw:min-w-0 tw:min-h-0 tw:rounded-lg tw:overflow-hidden`}
        >
          <PlayerList />
        </div>
      </div>
    </div>
  );
}

export default App;
