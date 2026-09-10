import { IconBase, type IconProps } from "../IconBase.js";

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 5l10 10 M15 5 5 15" />
    </IconBase>
  );
}
