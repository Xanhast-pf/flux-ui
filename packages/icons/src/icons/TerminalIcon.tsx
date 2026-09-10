import { IconBase, type IconProps } from "../IconBase.js";

export function TerminalIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 4h14v12H3V4Z M5.5 7.5 8 10l-2.5 2.5 M10 12.5h4" />
    </IconBase>
  );
}
