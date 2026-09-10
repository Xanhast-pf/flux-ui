import type { ComponentPropsWithRef } from "react";
export interface SpinnerProps extends Omit<
  ComponentPropsWithRef<"span">,
  "children" | "role" | "aria-label" | "aria-hidden"
> {
  /** Set null only when a nearby status already names the operation. */
  label?: string | null | undefined;
  size?: "sm" | "md" | "lg" | undefined;
}
