import { IconBase, type IconProps } from "../IconBase.js";

export function GridIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 3h5v5H3V3Z M12 3h5v5h-5V3Z M3 12h5v5H3v-5Z M12 12h5v5h-5v-5Z" />
    </IconBase>
  );
}
