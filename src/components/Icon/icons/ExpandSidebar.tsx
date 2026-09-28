import type { IconsProps } from "./icons"

export const ExpandSidebar = ({ width, height, fill, stroke}: IconsProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill={fill} stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-right-to-line preview-icon"><path d="M17 12H3"/><path d="m11 18 6-6-6-6"/><path d="M21 5v14"/></svg>
    )
}