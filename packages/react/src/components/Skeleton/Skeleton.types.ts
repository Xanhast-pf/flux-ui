import type { ComponentPropsWithRef } from "react";
export interface SkeletonProps extends Omit<
  ComponentPropsWithRef<"span">,
  "children" | "role" | "tabIndex" | "aria-hidden" | "dangerouslySetInnerHTML"
> {
  shape?: "line" | "block" | "circle" | undefined;
}
