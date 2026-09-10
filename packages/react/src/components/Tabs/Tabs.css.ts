import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  minWidth: 0,
});

export const list = style({
  display: "flex",
  gap: `var(${cssVars.space[1]})`,
  borderBottom: `0.0625rem solid var(${cssVars.color.border})`,
  selectors: {
    "&[aria-orientation='vertical']": {
      flexDirection: "column",
      borderBottom: 0,
      borderRight: `0.0625rem solid var(${cssVars.color.border})`,
    },
  },
});

export const tab = style({
  minHeight: `var(${cssVars.control.md})`,
  border: 0,
  borderBottom: "0.125rem solid transparent",
  background: "transparent",
  color: `var(${cssVars.color.textMuted})`,
  cursor: "pointer",
  font: "inherit",
  fontWeight: 650,
  paddingInline: `var(${cssVars.space[3]})`,
  transition: [
    `background-color var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
    `border-color var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
    `color var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
  ].join(", "),
  selectors: {
    "&:hover:not(:disabled)": {
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
    "&[data-orientation='vertical']": {
      justifyContent: "flex-start",
      borderRight: "0.125rem solid transparent",
      borderBottom: 0,
      textAlign: "left",
    },
    "&[data-orientation='vertical'][aria-selected='true']": {
      borderRightColor: `var(${cssVars.color.accent})`,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});

export const panel = style({
  paddingBlock: `var(${cssVars.space[4]})`,
});
