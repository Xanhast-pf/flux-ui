import type { ComponentPropsWithRef } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupProps = Omit<
  ComponentPropsWithRef<"div">,
  "role" | "aria-label" | "aria-labelledby"
> &
  AccessibleName & {
    orientation?: ButtonGroupOrientation | undefined;
  };
