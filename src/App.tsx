import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header/Header";

const borderString = "tw:border tw:border-black";

function App() {
  const [isSidepanelOpen, setSidePanel] = useState(true);
  return (
    <div className="tw:flex tw:flex-col tw:h-full tw:w-full tw:flex-1">
      <Header sidepanelState={{ isSidepanelOpen, setSidePanel }} />
      <div className="tw:flex tw:gap-1 tw:flex-1 tw:p-1 tw:h-full tw:w-full">
        {/* <div className={isSidepanelOpen ? `${borderString} tw:bg-white tw:min-w-96 tw:h-full tw:rounded-lg` : "tw:hidden"}>SidePanel</div> */}
        {isSidepanelOpen && (
          <div
            className={`${borderString} tw:bg-white tw:min-w-96 tw:h-full tw:rounded-lg`}
          >
            SidePanel
          </div>
        )}
        <div
          className={`${borderString} tw:bg-white tw:w-full tw:h-full tw:rounded-lg`}
        >
          Content
        </div>
      </div>
    </div>
  );
}

export default App;
