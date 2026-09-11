import { IconBase, type IconProps } from "../IconBase.js";

export function UnlockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 9h10v8H5V9Z M7 9V6a3 3 0 0 1 5.7-1.3" />
    </IconBase>
  );
}
