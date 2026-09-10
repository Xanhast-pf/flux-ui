import type { ComponentPropsWithRef } from "react";
export interface SkeletonProps extends Omit<
  ComponentPropsWithRef<"span">,
  "children" | "role" | "tabIndex" | "aria-hidden"
> {
  shape?: "line" | "block" | "circle" | undefined;
}
