import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const skeleton = style({
  display: "block",
  inlineSize: "100%",
  blockSize: "1rem",
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.border})`,
  selectors: {
    "&[data-shape='block']": { blockSize: "6rem" },
    "&[data-shape='circle']": {
      inlineSize: "3rem",
      blockSize: "3rem",
      borderRadius: "50%",
      flexShrink: 0,
    },
  },
  "@media": {
    "(forced-colors: active)": {
      background: "Canvas",
      border: "0.0625rem solid GrayText",
    },
  },
});
