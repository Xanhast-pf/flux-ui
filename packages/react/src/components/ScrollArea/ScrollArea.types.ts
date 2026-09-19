import type { ComponentPropsWithRef } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";
export type ScrollAreaProps = Omit<
  ComponentPropsWithRef<"div">,
  "role" | "aria-label" | "aria-labelledby" | "aria-hidden"
> &
  AccessibleName & {
    "aria-hidden"?: false | "false" | undefined;
    axis?: "horizontal" | "vertical" | "both" | undefined;
  };
