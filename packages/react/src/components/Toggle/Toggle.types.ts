import type { ComponentPropsWithRef } from "react";
import type {
  SelectionSize,
  SelectionVariant,
} from "../../internal/selection.types.js";
export type ToggleProps = Omit<
  ComponentPropsWithRef<"button">,
  "aria-pressed"
> & {
  size?: SelectionSize | undefined;
  variant?: SelectionVariant | undefined;
  onPressedChange?: ((pressed: boolean) => void) | undefined;
} & (
    | { pressed: boolean; defaultPressed?: never }
    | { pressed?: undefined; defaultPressed?: boolean | undefined }
  );
