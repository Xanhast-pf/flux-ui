import { style } from "@vanilla-extract/css";
export const meter = style({
  display: "block",
  inlineSize: "100%",
  minInlineSize: "3rem",
  blockSize: "1rem",
  accentColor: "var(--flux-color-accent)",
  selectors: {
    "&:focus-visible": {
      outline: "0.125rem solid var(--flux-color-focus)",
      outlineOffset: "0.125rem",
    },
  },
});
