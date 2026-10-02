import { IconBase, type IconProps } from "../IconBase.js";

export function ArrowUpDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 6 10 3l3 3 M10 3v14 M7 14l3 3 3-3" />
    </IconBase>
  );
}
