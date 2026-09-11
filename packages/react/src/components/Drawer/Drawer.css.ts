import { cssVars } from "@flux-ui/tokens";
import { keyframes, style } from "@vanilla-extract/css";

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

export const popup = style({
  position: "fixed",
  boxSizing: "border-box",
  maxWidth: "100vw",
  maxHeight: "100dvh",
  margin: 0,
  overflow: "auto",
  overscrollBehavior: "contain",
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: 0,
  background: `var(${cssVars.color.surfaceElevated})`,
  color: `var(${cssVars.color.text})`,
  boxShadow: "0 0 3rem rgb(0 0 0 / 0.2)",
  padding: `var(${cssVars.space[6]})`,
  animationDuration: `var(${cssVars.motion.normal})`,
  animationTimingFunction: `var(${cssVars.motion.easing})`,
  selectors: {
    "&::backdrop": {
      background: "rgb(2 6 23 / 0.58)",
      backdropFilter: "blur(0.125rem)",
    },
    "&:focus-visible": { outline: "none" },
    "&:where([data-side='left'], [data-side='right'])": {
      width: "min(24rem, calc(100vw - 3rem))",
      height: "100dvh",
      borderBlock: 0,
    },
    "&:where([data-side='top'], [data-side='bottom'])": {
      width: "100vw",
      maxHeight: "min(32rem, calc(100dvh - 3rem))",
      borderInline: 0,
    },
    "&:where([data-side='left'])": {
      inset: "0 auto 0 0",
      borderLeft: 0,
      animationName: enterFromLeft,
    },
    "&:where([data-side='right'])": {
      inset: "0 0 0 auto",
      borderRight: 0,
      animationName: enterFromRight,
    },
    "&:where([data-side='top'])": {
      inset: "0 0 auto",
      borderTop: 0,
      animationName: enterFromTop,
    },
    "&:where([data-side='bottom'])": {
      inset: "auto 0 0",
      borderBottom: 0,
      animationName: enterFromBottom,
    },
  },
  "@media": { "(prefers-reduced-motion: reduce)": { animation: "none" } },
});

export {
  modalAction as trigger,
  modalAction as close,
  title,
  description,
} from "../../internal/modalParts.css.js";
