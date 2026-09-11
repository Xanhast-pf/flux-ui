import { IconBase, type IconProps } from "../IconBase.js";

export function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5h12v12H4V5Z M7 3v4 M13 3v4 M4 8h12" />
    </IconBase>
  );
}
