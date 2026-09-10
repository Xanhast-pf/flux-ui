import type { ComponentPropsWithRef } from "react";
export interface SeparatorProps extends Omit<
  ComponentPropsWithRef<"hr">,
  "children" | "role" | "aria-orientation"
> {
  decorative?: boolean | undefined;
  orientation?: "horizontal" | "vertical" | undefined;
}
