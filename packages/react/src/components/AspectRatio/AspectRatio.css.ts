import { style } from "@vanilla-extract/css";
export const frame = style({
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
  },
  position: "relative",
  inlineSize: "100%",
  minInlineSize: 0,
  minBlockSize: 0,
  overflow: "hidden",
});
