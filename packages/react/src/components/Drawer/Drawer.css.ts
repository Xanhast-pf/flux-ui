import { cssVars } from "@flux-ui/tokens";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const enterFromLeft = keyframes({
  from: { transform: "translateX(-100%)" },
  to: { transform: "translateX(0)" },
});
const enterFromRight = keyframes({
  from: { transform: "translateX(100%)" },
  to: { transform: "translateX(0)" },
});
const enterFromTop = keyframes({
  from: { transform: "translateY(-100%)" },
  to: { transform: "translateY(0)" },
});
const enterFromBottom = keyframes({
  from: { transform: "translateY(100%)" },
  to: { transform: "translateY(0)" },
});

const reducedMotion = {
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
} as const;

export const popup = recipe({
  base: {
    position: "fixed",
    maxWidth: "none",
    maxHeight: "none",
    overflow: "auto",
    border: `0.0625rem solid var(${cssVars.color.border})`,
    borderRadius: 0,
    background: `var(${cssVars.color.surfaceElevated})`,
    color: `var(${cssVars.color.text})`,
    boxShadow: "0 0 3rem rgb(0 0 0 / 0.2)",
    padding: `var(${cssVars.space[6]})`,
    selectors: {
      "&::backdrop": {
        background: "rgb(2 6 23 / 0.58)",
        backdropFilter: "blur(0.125rem)",
      },
      "&:focus-visible": { outline: "none" },
    },
  },
  variants: {
    side: {
      left: {
        inset: "0 auto 0 0",
        width: "min(24rem, calc(100vw - 3rem))",
        height: "100dvh",
        margin: 0,
        borderBlock: 0,
        borderLeft: 0,
        animation: `${enterFromLeft} var(${cssVars.motion.normal}) var(${cssVars.motion.easing})`,
        ...reducedMotion,
      },
      right: {
        inset: "0 0 0 auto",
        width: "min(24rem, calc(100vw - 3rem))",
        height: "100dvh",
        margin: 0,
        borderBlock: 0,
        borderRight: 0,
        animation: `${enterFromRight} var(${cssVars.motion.normal}) var(${cssVars.motion.easing})`,
        ...reducedMotion,
      },
      top: {
        inset: "0 0 auto",
        width: "100vw",
        maxHeight: "min(32rem, calc(100dvh - 3rem))",
        margin: 0,
        borderInline: 0,
        borderTop: 0,
        animation: `${enterFromTop} var(${cssVars.motion.normal}) var(${cssVars.motion.easing})`,
        ...reducedMotion,
      },
      bottom: {
        inset: "auto 0 0",
        width: "100vw",
        maxHeight: "min(32rem, calc(100dvh - 3rem))",
        margin: 0,
        borderInline: 0,
        borderBottom: 0,
        animation: `${enterFromBottom} var(${cssVars.motion.normal}) var(${cssVars.motion.easing})`,
        ...reducedMotion,
      },
    },
  },
  defaultVariants: { side: "right" },
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
