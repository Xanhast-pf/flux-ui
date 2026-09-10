import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const root = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: `var(${cssVars.space[1]})`,
});
export const button = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minInlineSize: `var(${cssVars.control.sm})`,
  minBlockSize: `var(${cssVars.control.sm})`,
  paddingInline: `var(${cssVars.space[2]})`,
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
  font: "inherit",
  cursor: "pointer",
  selectors: {
    "&:hover:not(:disabled)": {
      background: `var(${cssVars.color.surfaceSubtle})`,
    },
    "&[aria-current='page']": {
      borderColor: `var(${cssVars.color.accent})`,
      background: `var(${cssVars.color.accentSoft})`,
      fontWeight: 700,
    },
    "&:disabled": { opacity: 0.6, cursor: "not-allowed" },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
  },
  "@media": {
    "(forced-colors: active)": {
      selectors: {
        "&[aria-current='page']": {
          outline: "0.125rem solid Highlight",
          outlineOffset: "-0.25rem",
        },
        "&:disabled": { color: "GrayText", opacity: 1 },
      },
    },
  },
});
export const ellipsis = style({
  paddingInline: `var(${cssVars.space[2]})`,
  color: `var(${cssVars.color.textMuted})`,
});
