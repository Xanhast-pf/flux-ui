import { IconBase, type IconProps } from "../IconBase.js";

export function GaugeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3.5 14.5a7 7 0 1 1 13 0 M10 10l3.5-3.5 M6 14h8" />
    </IconBase>
  );
}
