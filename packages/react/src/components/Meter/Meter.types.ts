import type { ComponentPropsWithRef } from "react";
import type { AccessibleNameOrHidden } from "../../internal/accessibility.types.js";

export type MeterProps = Omit<
  ComponentPropsWithRef<"meter">,
  "value" | "min" | "max" | "aria-label" | "aria-labelledby" | "aria-hidden"
> &
  AccessibleNameOrHidden & {
    /** Finite measured value. Render an explicit pending/unknown state outside Meter. */
    value: number;
    min?: number | undefined;
    max?: number | undefined;
  };
