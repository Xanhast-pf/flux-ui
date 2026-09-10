import { IconBase, type IconProps } from "../IconBase.js";

export function CommandIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 7H5a2 2 0 1 1 2-2v10a2 2 0 1 1-2-2h10a2 2 0 1 1-2 2V5a2 2 0 1 1 2 2H7Z" />
    </IconBase>
  );
}
