import type { ComponentPropsWithRef, ReactNode } from "react";
import type { StatusBadgeTone } from "../StatusBadge/StatusBadge.types.js";

export type IndicatorPlacement =
  "top-start" | "top-end" | "bottom-start" | "bottom-end";

export interface IndicatorProps extends Omit<
  ComponentPropsWithRef<"span">,
  "children" | "content"
> {
  children: ReactNode;
  /** Omit content for a dot indicator. Numeric content may be capped with max. */
  content?: string | number | undefined;
  /** Maximum displayed numeric count before rendering "max+". Defaults to 99. */
  max?: number | undefined;
  tone?: StatusBadgeTone | undefined;
  placement?: IndicatorPlacement | undefined;
}
