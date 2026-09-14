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
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
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
  border: "0 solid transparent",
  borderBottomWidth: "0.125rem",
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
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
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
      borderWidth: 0,
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
      borderInlineEndWidth: "0.125rem",
      borderBottomWidth: 0,
      textAlign: "start",
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
