import { cssVars } from "@flux-ui/tokens";
import { keyframes, style } from "@vanilla-extract/css";
const turn = keyframes({ to: { transform: "rotate(360deg)" } });
export const spinner = style({
  display: "inline-block",
  position: "relative",
  inlineSize: "1.5rem",
  blockSize: "1.5rem",
  flexShrink: 0,
  verticalAlign: "middle",
  color: `var(${cssVars.color.textMuted})`,
  selectors: {
    "&[data-size='sm']": { inlineSize: "1rem", blockSize: "1rem" },
    "&[data-size='lg']": { inlineSize: "2rem", blockSize: "2rem" },
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      border: "0.125rem solid currentColor",
      borderInlineEndColor: "transparent",
      borderRadius: "50%",
      boxSizing: "border-box",
      animation: `${turn} 800ms linear infinite`,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      selectors: { "&::before": { animation: "none" } },
    },
    "(forced-colors: active)": { color: "CanvasText" },
  },
});
