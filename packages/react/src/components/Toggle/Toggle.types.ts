import type { ComponentPropsWithRef, MouseEvent } from "react";
import type {
  SelectionAppearance,
  SelectionSize,
} from "../../internal/selection.types.js";
export type ToggleProps = Omit<
  ComponentPropsWithRef<"button">,
  "aria-pressed"
> & {
  size?: SelectionSize | undefined;
  appearance?: SelectionAppearance | undefined;
  onPressedChange?:
    | ((pressed: boolean, event: MouseEvent<HTMLButtonElement>) => void)
    | undefined;
} & (
    | { pressed: boolean; defaultPressed?: never }
    | { pressed?: undefined; defaultPressed?: boolean | undefined }
  );
