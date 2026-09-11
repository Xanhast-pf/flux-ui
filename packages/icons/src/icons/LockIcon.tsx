import { IconBase, type IconProps } from "../IconBase.js";

export function LockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 9h10v8H5V9Z M7 9V6a3 3 0 0 1 6 0v3" />
    </IconBase>
  );
}
