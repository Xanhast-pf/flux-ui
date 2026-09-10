import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const separator = style({
  margin: 0,
  border: "none",
  background: `var(${cssVars.color.border})`,
  blockSize: "0.0625rem",
  inlineSize: "100%",
  flexShrink: 0,
  selectors: {
    "&[data-orientation='vertical']": {
      inlineSize: "0.0625rem",
      blockSize: "auto",
      minBlockSize: "1rem",
      alignSelf: "stretch",
    },
  },
});
