import type {
  LayoutGap,
  LayoutSpacing,
  ResponsiveScope,
  ResponsiveValue,
} from "../../internal/layout.js";
import type {
  LayoutElement,
  SemanticProps,
} from "../../internal/semantic.types.js";

export type InlineProps = SemanticProps<
  LayoutElement,
  "div",
  LayoutSpacing & {
    responsiveTo?: ResponsiveScope | undefined;
    gap?: ResponsiveValue<LayoutGap> | undefined;
    align?: "start" | "center" | "end" | "baseline" | "stretch" | undefined;
    justify?: "start" | "center" | "end" | "between" | undefined;
    wrap?: boolean | undefined;
  }
>;
