import { cssVars } from "@flux-ui/tokens";
import { keyframes, style } from "@vanilla-extract/css";

const spin = keyframes({
  to: { transform: "rotate(360deg)" },
});

export const button = style({
  appearance: "none",
  position: "relative",
  cursor: "pointer",
  userSelect: "none",
  selectors: {
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
    "&:disabled": { cursor: "not-allowed", opacity: 0.52 },
  },
});

export const content = style({
  display: "inline-flex",
  alignItems: "center",
  gap: `var(${cssVars.space[2]})`,
  selectors: {
    "button[data-loading='true'] &": { opacity: 0 },
  },
});

export const spinner = style({
  width: "1rem",
  height: "1rem",
  border: "0.125rem solid currentColor",
  borderRightColor: "transparent",
  borderRadius: "50%",
  animation: `${spin} 650ms linear infinite`,
  position: "absolute",
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});
