import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const toggle = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: `var(${cssVars.space[2]})`,
  minBlockSize: `var(${cssVars.control.sm})`,
  padding: `var(${cssVars.space[1]}) var(${cssVars.space[3]})`,
  border: `0.0625rem solid var(${cssVars.color.borderStrong})`,
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
  font: "inherit",
  fontWeight: 600,
  cursor: "pointer",
  selectors: {
    "&:hover:not(:disabled)": {
      background: `var(${cssVars.color.surfaceSubtle})`,
    },
    "&[aria-pressed='true']": {
      background: `var(${cssVars.color.accentSoft})`,
      borderColor: `var(${cssVars.color.accent})`,
      boxShadow: `inset 0 -0.125rem var(${cssVars.color.accent})`,
    },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
    "&:disabled": { opacity: 0.6, cursor: "not-allowed" },
  },
  "@media": {
    "(forced-colors: active)": {
      selectors: {
        "&[aria-pressed='true']": {
          outline: "0.125rem solid Highlight",
          outlineOffset: "-0.25rem",
        },
        "&:disabled": { opacity: 1, color: "GrayText" },
      },
    },
  },
});
