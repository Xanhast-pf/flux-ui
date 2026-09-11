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

export {
  modalAction as trigger,
  modalAction as close,
  title,
  description,
} from "../../internal/modalParts.css.js";
