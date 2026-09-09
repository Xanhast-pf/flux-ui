import { cssVars } from "@flux-ui/tokens";
import { style, styleVariants } from "@vanilla-extract/css";

export const container = style({
  inlineSize: "100%",
  minInlineSize: 0,
  marginInline: "auto",
  paddingInline: `var(${cssVars.space[4]})`,
});

export const sizes = styleVariants({
  sm: { maxInlineSize: "40rem" },
  md: { maxInlineSize: "56rem" },
  lg: { maxInlineSize: "72rem" },
  xl: { maxInlineSize: "90rem" },
  full: { maxInlineSize: "none" },
});
