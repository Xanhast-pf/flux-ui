import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const textarea = style({
  boxSizing: "border-box",
  inlineSize: "100%",
  minInlineSize: 0,
  minBlockSize: "5rem",
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
  paddingBlock: `var(${cssVars.space[2]})`,
  paddingInline: `var(${cssVars.space[3]})`,
  font: "inherit",
  fontSize: "1rem",
  lineHeight: 1.5,
  resize: "vertical",
  transition: [
    `background-color var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
    `border-color var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
    `color var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
  ].join(", "),
  selectors: {
    "&::placeholder": {
      color: `var(${cssVars.color.textSubtle})`,
      opacity: 1,
    },
    "&:hover:not(:disabled)": {
      borderColor: `var(${cssVars.color.borderStrong})`,
    },
    "&:focus-visible": {
      borderColor: `var(${cssVars.color.focus})`,
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
    "&:disabled": {
      cursor: "not-allowed",
      background: `var(${cssVars.color.surfaceSubtle})`,
      color: `var(${cssVars.color.textMuted})`,
      opacity: 0.62,
    },
    "&:read-only:not(:disabled)": {
      background: `var(${cssVars.color.surfaceSubtle})`,
    },
    "&[aria-invalid='true']": {
      borderColor: `var(${cssVars.color.danger})`,
    },
    "&[data-invalid='true']": {
      borderColor: `var(${cssVars.color.danger})`,
    },
    "&:user-invalid": {
      borderColor: `var(${cssVars.color.danger})`,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});
