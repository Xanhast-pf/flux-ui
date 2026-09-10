import { IconBase, type IconProps } from "../IconBase.js";

export function InfoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z M10 9v4 M10 6.5h.01" />
    </IconBase>
  );
}
