import type { ComponentPropsWithRef } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";
export type LevelMeterProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "aria-label" | "aria-labelledby"
> &
  AccessibleName & {
    value: number;
    min?: number | undefined;
    max?: number | undefined;
    /** Caller-managed peak hold; the component starts no timers or audio graph. */
    peak?: number | undefined;
    clipped?: boolean | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
  };
