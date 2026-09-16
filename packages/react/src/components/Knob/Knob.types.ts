import type { ComponentPropsWithRef, CSSProperties } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";
export type KnobProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "defaultValue" | "aria-label" | "aria-labelledby" | "style"
> &
  AccessibleName & {
    size?: "sm" | "md" | "lg" | undefined;
    /** Public diameter override. All dial geometry scales with it. */
    style?:
      (CSSProperties & { "--flux-knob-size"?: string | undefined }) | undefined;
    /** Double-click target; required for reset in controlled mode. */
    resetValue?: number | undefined;
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
