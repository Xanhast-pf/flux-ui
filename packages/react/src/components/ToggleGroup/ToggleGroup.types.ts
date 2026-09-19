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
type Single =
  | {
      type: "single";
      value: string | null;
      defaultValue?: never;
      onValueChange: (value: string | null) => void;
    }
  | {
      type: "single";
      value?: undefined;
      defaultValue?: string | null | undefined;
      onValueChange?: ((value: string | null) => void) | undefined;
    };
type Multiple =
  | {
      type: "multiple";
      value: readonly string[];
      defaultValue?: never;
      onValueChange: (value: readonly string[]) => void;
    }
  | {
      type: "multiple";
      value?: undefined;
      defaultValue?: readonly string[] | undefined;
      onValueChange?: ((value: readonly string[]) => void) | undefined;
    };
export type ToggleGroupRootProps = RootBase & (Single | Multiple);
export type ToggleGroupItemProps = Omit<
  ComponentPropsWithRef<"button">,
  "value" | "aria-pressed" | "tabIndex"
> & { value: string };
