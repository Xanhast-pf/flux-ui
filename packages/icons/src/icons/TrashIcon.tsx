import { IconBase, type IconProps } from "../IconBase.js";

export function TrashIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 6h12 M7 6V4h6v2 M6 6l.7 11h6.6L14 6 M8.5 9v5 M11.5 9v5" />
    </IconBase>
  );
}
