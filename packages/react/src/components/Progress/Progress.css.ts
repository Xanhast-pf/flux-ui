import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const progress = style({
  appearance: "auto",
  inlineSize: "100%",
  blockSize: "0.75rem",
  verticalAlign: "middle",
  accentColor: `var(${cssVars.color.accent})`,
  selectors: {
    "&::-webkit-progress-bar": {
      background: `var(${cssVars.color.surfaceSubtle})`,
      borderRadius: `var(${cssVars.radius.md})`,
    },
    "&::-webkit-progress-value": {
      background: `var(${cssVars.color.accent})`,
      borderRadius: `var(${cssVars.radius.md})`,
    },
    "&::-moz-progress-bar": { background: `var(${cssVars.color.accent})` },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      selectors: {
        "&:indeterminate": {
          appearance: "none",
          background: `var(${cssVars.color.surfaceSubtle})`,
          border: `0.0625rem dashed var(${cssVars.color.borderStrong})`,
        },
        "&:indeterminate::-webkit-progress-bar": {
          background: `var(${cssVars.color.surfaceSubtle})`,
        },
        "&:indeterminate::-webkit-progress-value": {
          background: "transparent",
          animation: "none",
        },
        "&:indeterminate::-moz-progress-bar": {
          background: "transparent",
          animation: "none",
        },
      },
    },
  },
});
