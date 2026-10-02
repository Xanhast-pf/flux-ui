import { IconBase, type IconProps } from "../IconBase.js";

export function VolumeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 8h3l3-3v10l-3-3H4V8Z M13 7.5a4 4 0 0 1 0 5 M15 5.5a7 7 0 0 1 0 9" />
    </IconBase>
  );
}
