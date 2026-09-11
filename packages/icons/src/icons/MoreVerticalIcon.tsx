import { IconBase, type IconProps } from "../IconBase.js";

export function MoreVerticalIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 5h.01 M10 10h.01 M10 15h.01" />
    </IconBase>
  );
}
