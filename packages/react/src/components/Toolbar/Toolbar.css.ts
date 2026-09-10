import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `var(${cssVars.space[1]})`,
  padding: `var(${cssVars.space[1]})`,
  borderRadius: `var(${cssVars.radius.md})`,
  border: `0.0625rem solid var(${cssVars.color.border})`,
  background: `var(${cssVars.color.surfaceSubtle})`,
  selectors: {
    "&[data-orientation='vertical']": {
      flexDirection: "column",
      alignItems: "stretch",
    },
  },
});

const control = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: `var(${cssVars.space[2]})`,
  minBlockSize: `var(${cssVars.control.sm})`,
  paddingInline: `var(${cssVars.space[3]})`,
  borderRadius: `var(${cssVars.radius.sm})`,
  font: "inherit",
  fontSize: "0.875rem",
  color: `var(${cssVars.color.text})`,
  selectors: {
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
  },
});

export const action = style([
  control,
  {
    appearance: "none",
    border: "0.0625rem solid transparent",
    background: "transparent",
    cursor: "pointer",
    userSelect: "none",
    transition: `background-color var(${cssVars.motion.fast}) var(${cssVars.motion.easing}), border-color var(${cssVars.motion.fast}) var(${cssVars.motion.easing}), transform var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
    selectors: {
      "&:hover:not(:disabled):not([aria-pressed='true'])": {
        background: `var(${cssVars.color.surface})`,
      },
      "&[aria-pressed='true']": {
        background: `var(${cssVars.color.accentSoft})`,
        borderColor: `var(${cssVars.color.accent})`,
      },
      "&:active:not(:disabled)": { transform: "scale(0.985)" },
      "&:disabled": { cursor: "not-allowed", opacity: 0.52 },
      "&[aria-busy='true']": { cursor: "progress" },
    },
    "@media": {
      "(prefers-reduced-motion: reduce)": { transition: "none" },
      "(forced-colors: active)": {
        borderColor: "ButtonText",
        selectors: {
          "&:disabled": {
            color: "GrayText",
            borderColor: "GrayText",
            opacity: 1,
          },
          "&[aria-pressed='true']": {
            outline: "0.125rem solid Highlight",
            outlineOffset: "-0.25rem",
          },
        },
      },
    },
  },
]);

export const link = style([
  control,
  {
    textUnderlineOffset: "0.25rem",
  },
]);

export const divider = style({
  margin: `var(${cssVars.space[1]})`,
  border: "none",
  background: `var(${cssVars.color.border})`,
  inlineSize: "100%",
  blockSize: "0.0625rem",
  flexShrink: 0,
  alignSelf: "stretch",
  selectors: {
    "&[data-orientation='vertical']": {
      inlineSize: "0.0625rem",
      blockSize: "auto",
      minBlockSize: "1rem",
    },
  },
});
