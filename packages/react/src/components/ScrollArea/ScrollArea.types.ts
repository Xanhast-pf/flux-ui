import type { ComponentPropsWithRef } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";
export type ScrollAreaProps = Omit<
  ComponentPropsWithRef<"div">,
  "role" | "aria-label" | "aria-labelledby"
> &
  AccessibleName & {
    axis?: "horizontal" | "vertical" | "both" | undefined;
  };
