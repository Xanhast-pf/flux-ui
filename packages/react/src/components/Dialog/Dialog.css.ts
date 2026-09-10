import { cssVars } from "@flux-ui/tokens";
import { keyframes, style } from "@vanilla-extract/css";

const enter = keyframes({
  from: { opacity: 0, transform: "translateY(0.5rem) scale(0.985)" },
  to: { opacity: 1, transform: "translateY(0) scale(1)" },
});

export const popup = style({
  width: "min(32rem, calc(100vw - 2rem))",
  maxHeight: "min(42rem, calc(100dvh - 2rem))",
  overflow: "auto",
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: `var(${cssVars.radius.lg})`,
  background: `var(${cssVars.color.surfaceElevated})`,
  color: `var(${cssVars.color.text})`,
  boxShadow: "0 1.5rem 4rem rgb(0 0 0 / 0.22)",
  padding: `var(${cssVars.space[6]})`,
  animation: `${enter} var(${cssVars.motion.normal}) var(${cssVars.motion.easing})`,
  selectors: {
    "&::backdrop": {
      background: "rgb(2 6 23 / 0.58)",
      backdropFilter: "blur(0.125rem)",
    },
    "&:focus-visible": { outline: "none" },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

const actionBase = {
  minHeight: `var(${cssVars.control.md})`,
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
  cursor: "pointer",
  font: "inherit",
  paddingInline: `var(${cssVars.space[4]})`,
  selectors: {
    "&:hover": { background: `var(${cssVars.color.surfaceSubtle})` },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
  },
} as const;

export const trigger = style(actionBase);
export const close = style(actionBase);

export const title = style({
  margin: 0,
  fontSize: "1.25rem",
  lineHeight: 1.2,
});

export const description = style({
  marginBlock: `var(${cssVars.space[2]}) var(${cssVars.space[5]})`,
  color: `var(${cssVars.color.textMuted})`,
  lineHeight: 1.5,
});
