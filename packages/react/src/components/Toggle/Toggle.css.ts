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
    "&[data-s='sm']": {
      minBlockSize: "var(--flux-control-sm)",
      fontSize: "var(--flux-font-caption)",
    },
    "&[data-s='md']": {
      minBlockSize: "var(--flux-control-md)",
      fontSize: "var(--flux-font-body-size)",
    },
    "&[data-s='lg']": {
      minBlockSize: "var(--flux-control-lg)",
      fontSize: "var(--flux-font-lead)",
    },
    "&[data-a='quiet']:not([aria-pressed='true'])": {
      borderColor: "transparent",
      background: "transparent",
    },
    "&[data-a='tile']": {
      display: "grid",
      minBlockSize: "6rem",
      inlineSize: "100%",
      padding: "var(--flux-space-3)",
    },
    "&:hover:not(:disabled):not([aria-pressed='true'])": {
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
