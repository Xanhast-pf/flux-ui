import { IconBase, type IconProps } from "../IconBase.js";

export function FileIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 3h6l4 4v10H5V3Z M11 3v4h4" />
    </IconBase>
  );
}
