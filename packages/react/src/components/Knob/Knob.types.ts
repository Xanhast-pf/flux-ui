import type { ComponentPropsWithRef, CSSProperties } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";

type KnobBaseProps = Omit<
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
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    scale?: "linear" | "log" | undefined;
    disabled?: boolean | undefined;
    formatValue?: ((value: number) => string) | undefined;
    onValueCommit?: ((value: number) => void) | undefined;
  };

type KnobUncontrolledProps = {
  value?: undefined;
  defaultValue?: number | undefined;
  onValueChange?: ((value: number) => void) | undefined;
};

type KnobControlledProps = {
  value: number;
  defaultValue?: never;
  onValueChange: (value: number) => void;
};

export type KnobProps = KnobBaseProps &
  (KnobUncontrolledProps | KnobControlledProps);
