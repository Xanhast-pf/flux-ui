import { IconBase, type IconProps } from "../IconBase.js";

export function UndoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 5 3 9l4 4 M3.5 9H11a5 5 0 0 1 5 5v1" />
    </IconBase>
  );
}
