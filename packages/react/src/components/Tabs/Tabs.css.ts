import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  minInlineSize: 0,
  maxInlineSize: "100%",
});

export const list = style({
  minInlineSize: 0,
  maxInlineSize: "100%",
  overflowX: "auto",
  overscrollBehaviorInline: "contain",
  display: "flex",
  flexWrap: "nowrap",
  gap: `var(${cssVars.space[1]})`,
  borderBottom: `0.0625rem solid var(${cssVars.color.border})`,
  selectors: {
    "&[data-w]": { flexWrap: "wrap" },
    "&[data-a='pill']": { border: 0 },
    "&[aria-orientation='vertical']": {
      flexDirection: "column",
      borderBottom: 0,
      borderInlineEnd: `0.0625rem solid var(${cssVars.color.border})`,
    },
  },
});

export const tab = style({
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--flux-space-2)",
  minHeight: `var(${cssVars.control.md})`,
  border: 0,
  borderBottom: "0.125rem solid transparent",
  background: "transparent",
  color: `var(${cssVars.color.textMuted})`,
  cursor: "pointer",
  font: "inherit",
  fontWeight: 650,
  paddingInline: `var(${cssVars.space[3]})`,
  transitionProperty: "background-color, border-color, color",
  transitionDuration: `var(${cssVars.motion.fast})`,
  transitionTimingFunction: `var(${cssVars.motion.easing})`,
  selectors: {
    "&[data-s='sm']": {
      minHeight: "var(--flux-control-sm)",
      fontSize: "var(--flux-font-caption)",
    },
    "&[data-s='lg']": {
      minHeight: "var(--flux-control-lg)",
      fontSize: "var(--flux-font-lead)",
    },
    "&[data-a='pill']": {
      borderRadius: "var(--flux-radius-md)",
      border: 0,
    },
    "&[data-a='pill'][aria-selected='true']": {
      background: "var(--flux-color-text)",
      color: "var(--flux-color-surface)",
    },
    "&:hover:not(:disabled):not([aria-selected='true'])": {
      background: `var(${cssVars.color.surfaceSubtle})`,
      color: `var(${cssVars.color.text})`,
    },
    "&[aria-selected='true']": {
      borderColor: `var(${cssVars.color.accent})`,
      color: `var(${cssVars.color.text})`,
    },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "-0.125rem",
    },
    "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
    "&[data-o='vertical']": {
      justifyContent: "flex-start",
      borderInlineEnd: "0.125rem solid transparent",
      borderBottom: 0,
      textAlign: "start",
    },
    "&[data-o='vertical'][aria-selected='true']": {
      borderInlineEndColor: `var(${cssVars.color.accent})`,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
    "(forced-colors: active)": {
      selectors: {
        "&[aria-selected='true']": {
          outline: "0.125rem solid Highlight",
          outlineOffset: "-0.25rem",
        },
      },
    },
  },
});

export const panel = style({
  selectors: {
    "&[data-p='none']": { padding: 0 },
  },
  paddingBlock: `var(${cssVars.space[4]})`,
});
