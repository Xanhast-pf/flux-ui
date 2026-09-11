import { IconBase, type IconProps } from "../IconBase.js";

export function ExpandIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 4H4v4 M12 4h4v4 M8 16H4v-4 M12 16h4v-4" />
    </IconBase>
  );
}
