import type { ComponentPropsWithRef } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";
import type {
  SelectionAppearance,
  SelectionSize,
} from "../../internal/selection.types.js";
type RootBase = Omit<
  ComponentPropsWithRef<"div">,
  "role" | "aria-label" | "aria-labelledby" | "defaultValue"
> &
  AccessibleName & {
    size?: SelectionSize | undefined;
    appearance?: SelectionAppearance | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    loopFocus?: boolean | undefined;
    disabled?: boolean | undefined;
  };
type Single = {
  type: "single";
  onValueChange?: ((value: string | null) => void) | undefined;
} & (
  | { value: string | null; defaultValue?: never }
  | { value?: undefined; defaultValue?: string | null | undefined }
);
type Multiple = {
  type: "multiple";
  onValueChange?: ((value: readonly string[]) => void) | undefined;
} & (
  | { value: readonly string[]; defaultValue?: never }
  | { value?: undefined; defaultValue?: readonly string[] | undefined }
);
export type ToggleGroupRootProps = RootBase & (Single | Multiple);
export type ToggleGroupItemProps = Omit<
  ComponentPropsWithRef<"button">,
  "value" | "aria-pressed" | "tabIndex"
> & { value: string };
