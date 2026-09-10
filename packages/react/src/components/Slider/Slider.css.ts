import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const slider = style({
  appearance: "auto",
  accentColor: `var(${cssVars.color.accent})`,
  inlineSize: "100%",
  minInlineSize: 0,
  blockSize: `var(${cssVars.control.md})`,
  margin: 0,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.25rem",
    },
    "&:disabled": { cursor: "not-allowed", opacity: 0.62 },
  },
});
