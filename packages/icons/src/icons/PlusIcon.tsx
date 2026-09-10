import { IconBase, type IconProps } from "../IconBase.js";

export function PlusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 4v12 M4 10h12" />
    </IconBase>
  );
}
