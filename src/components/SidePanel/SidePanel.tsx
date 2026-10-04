import React from "react";
import { DraftBoard } from "./DraftBoard";

export const SidePanel: React.FC = () => {
  return (
    <div className="tw:flex tw:flex-col tw:h-full tw:w-full tw:min-w-0">
      <DraftBoard />
      {/* Future sidebar components go here */}
    </div>
  );
};
