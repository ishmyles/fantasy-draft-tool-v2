import { type IconProps } from "./icon.d";
import * as Icons from "./icons";

export const Icon = ({
  name,
  size = 24,
  stroke = "currentColor",
  fill = "none",
  ...props
}: IconProps) => {
  const SelectedIcon = Icons[name] as React.ComponentType<any>;

  if (!SelectedIcon) {
    console.warn(`Icon "${name}" does not exist in the icons directory.`);
    return null;
  }

  return (
    <SelectedIcon
      width={size}
      height={size}
      size={size}
      stroke={stroke}
      fill={fill}
      {...props} // Spreads rest props like className, onClick, jerseyColor, etc.
    />
  );
};
