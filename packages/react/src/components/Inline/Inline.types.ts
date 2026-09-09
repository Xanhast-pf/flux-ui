import type { ComponentPropsWithRef } from "react";
import type { LayoutGap, ResponsiveValue } from "../../internal/layout.js";

export interface InlineProps extends ComponentPropsWithRef<"div"> {
  gap?: ResponsiveValue<LayoutGap>;
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
}
