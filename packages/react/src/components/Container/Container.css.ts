import { style, styleVariants } from "@vanilla-extract/css";

export const container = style({
  inlineSize: "100%",
  minInlineSize: 0,
  marginInline: "auto",
  paddingInline: "clamp(1rem, 3vw, 2rem)",
});

export const sizes = styleVariants({
  sm: { maxInlineSize: "40rem" },
  md: { maxInlineSize: "56rem" },
  lg: { maxInlineSize: "72rem" },
  xl: { maxInlineSize: "90rem" },
  full: { maxInlineSize: "none" },
});
