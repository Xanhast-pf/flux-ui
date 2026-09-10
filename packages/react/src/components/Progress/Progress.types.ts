import type { ComponentPropsWithRef } from "react";
export interface ProgressProps extends Omit<
  ComponentPropsWithRef<"progress">,
  "value" | "max"
> {
  /** Omit value for indeterminate progress; zero remains a real determinate value. */
  value?: number | undefined;
  max?: number | undefined;
}
