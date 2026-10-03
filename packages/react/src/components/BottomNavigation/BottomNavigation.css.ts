import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  alignItems: "stretch",
  inlineSize: "100%",
  overflowX: "auto",
  borderBlockStart: `0.0625rem solid var(${cssVars.color.border})`,
  background: `var(${cssVars.color.surface})`,
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": {
      display: "none !important",
    },
  },
});

export const item = style({
  display: "inline-flex",
  flex: "1 0 4.5rem",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: `var(${cssVars.space[1]})`,
  minInlineSize: "4.5rem",
  minBlockSize: "4rem",
  boxSizing: "border-box",
  padding: `var(${cssVars.space[2]})`,
  color: `var(${cssVars.color.textMuted})`,
  fontSize: "0.75rem",
  fontWeight: 600,
  lineHeight: 1.25,
  textAlign: "center",
  textDecoration: "none",
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": {
      display: "none !important",
    },
    "&:hover": {
      background: `var(${cssVars.color.surfaceSubtle})`,
      color: `var(${cssVars.color.text})`,
    },
    "&[aria-current='page']": {
      background: `var(${cssVars.color.accentSoft})`,
      color: `var(${cssVars.color.accent})`,
      fontWeight: 700,
    },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "-0.125rem",
    },
  },
  "@media": {
    "(forced-colors: active)": {
      selectors: {
        "&[aria-current='page']": {
          background: "Canvas",
          color: "CanvasText",
          outline: "0.125rem solid Highlight",
          outlineOffset: "-0.25rem",
        },
      },
    },
  },
});

export const icon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 0,
});

export const label = style({
  minInlineSize: 0,
  maxInlineSize: "100%",
  overflowWrap: "anywhere",
});
