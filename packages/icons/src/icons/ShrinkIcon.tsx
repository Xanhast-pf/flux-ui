import { IconBase, type IconProps } from "../IconBase.js";

export function ShrinkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 8h4V4 M16 8h-4V4 M4 12h4v4 M16 12h-4v4" />
    </IconBase>
  );
}
