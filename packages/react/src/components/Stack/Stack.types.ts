import type { ComponentPropsWithRef } from "react";
import type { LayoutGap, ResponsiveValue } from "../../internal/layout.js";

export interface StackProps extends ComponentPropsWithRef<"div"> {
  gap?: ResponsiveValue<LayoutGap>;
  align?: "start" | "center" | "end" | "stretch";
}
