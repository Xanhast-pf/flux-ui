import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const checkbox = style({
  // Keep native check/mixed glyphs and forced-colors rendering. Do not replace
  // the input with a button, hidden proxy, SVG, or pseudo-element indicator.
  appearance: "auto",
  accentColor: `var(${cssVars.color.accent})`,
  boxSizing: "border-box",
  inlineSize: "1.5rem",
  blockSize: "1.5rem",
  flexShrink: 0,
  margin: 0,
  verticalAlign: "middle",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.25rem",
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.62,
    },
    "&[aria-invalid='true'], &[data-invalid='true'], &:user-invalid": {
      boxShadow: `0 0 0 0.125rem var(${cssVars.color.danger})`,
    },
  },
  "@media": {
    "(forced-colors: active)": {
      selectors: {
        "&[aria-invalid='true'], &[data-invalid='true'], &:user-invalid": {
          boxShadow: "none",
          outline: "0.125rem dashed CanvasText",
          outlineOffset: "0.125rem",
        },
        "&:focus-visible": {
          outline: "0.125rem solid Highlight",
          outlineOffset: "0.25rem",
        },
      },
    },
  },
});
