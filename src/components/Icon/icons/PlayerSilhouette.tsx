import React from "react";
import { getTeamColors } from "../../../utils/teamColors";

export interface PlayerSilhouetteProps extends React.SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  size?: string | number;
  silhouetteColor?: string;
  jerseyColor?: string;
  jerseyOutlineColor?: string;
  team?: string;
}

export const PlayerSilhouette: React.FC<PlayerSilhouetteProps> = ({
  width,
  height,
  size = 24,
  silhouetteColor = "#94a3b8",
  jerseyColor,
  jerseyOutlineColor,
  team,
  className,
  ...props
}) => {
  const finalSize = size ?? width ?? height ?? 24;
  const teamDefaults = getTeamColors(team);

  const finalJerseyColor = jerseyColor ?? (team ? teamDefaults.primary : "#1d428a");
  const finalJerseyOutlineColor =
    jerseyOutlineColor ?? (team ? teamDefaults.secondary : "#ffc72c");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={finalSize}
      height={finalSize}
      fill="none"
      className={className}
      {...props}
    >
      {/* ── 1. Player Silhouette (Head, Neck, Shoulders/Arms) ── */}
      {/* Head */}
      <circle cx="32" cy="18" r="9.5" fill={silhouetteColor} />
      {/* Shoulders & Upper Arms */}
      <path
        d="M 27 26 C 22 28, 14 34, 10 42 L 8 64 L 56 64 L 54 42 C 50 34, 42 28, 37 26 Z"
        fill={silhouetteColor}
      />

      {/* ── 2. Jersey Inner Part ── */}
      <path
        d="M 21 29 L 26 29 Q 32 37 38 29 L 43 29 Q 46 36 49 43 L 50 64 L 14 64 L 15 43 Q 18 36 21 29 Z"
        fill={finalJerseyColor}
      />

      {/* ── 3. Jersey Outline & Trim ── */}
      {/* Outer Border */}
      <path
        d="M 21 29 L 26 29 Q 32 37 38 29 L 43 29 Q 46 36 49 43 L 50 64 L 14 64 L 15 43 Q 18 36 21 29 Z"
        stroke={finalJerseyOutlineColor}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Scoop/V Neckline Trim */}
      <path
        d="M 26 29 Q 32 37 38 29"
        stroke={finalJerseyOutlineColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Left Armhole Trim */}
      <path
        d="M 21 29 Q 18 36 15 43"
        stroke={finalJerseyOutlineColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Right Armhole Trim */}
      <path
        d="M 43 29 Q 46 36 49 43"
        stroke={finalJerseyOutlineColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Horizontal Chest Team Name Bar */}
      <rect
        x="21"
        y="43"
        width="22"
        height="5.5"
        rx="2"
        fill={finalJerseyOutlineColor}
      />
    </svg>
  );
};

