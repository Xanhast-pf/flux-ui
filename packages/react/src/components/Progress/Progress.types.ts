import type { ComponentPropsWithRef } from "react";
import type { AccessibleNameOrHidden } from "../../internal/accessibility.types.js";

export type ProgressProps = Omit<
  ComponentPropsWithRef<"progress">,
  "value" | "max" | "aria-label" | "aria-labelledby" | "aria-hidden"
> &
  AccessibleNameOrHidden & {
    /** Omit value for indeterminate progress; zero remains a real determinate value. */
    value?: number | undefined;
    max?: number | undefined;
  };
