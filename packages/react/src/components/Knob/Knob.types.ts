import type { ComponentPropsWithRef } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";
export type KnobProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "defaultValue" | "aria-label" | "aria-labelledby"
> &
  AccessibleName & {
    value?: number | undefined;
    defaultValue?: number | undefined;
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    scale?: "linear" | "log" | undefined;
    disabled?: boolean | undefined;
    formatValue?: ((value: number) => string) | undefined;
    onValueChange?: ((value: number) => void) | undefined;
    onValueCommit?: ((value: number) => void) | undefined;
  };
