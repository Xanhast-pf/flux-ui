import { style } from "@vanilla-extract/css";
export const fader = style({
  selectors: {
    "&&": {
      writingMode: "vertical-lr",
      direction: "rtl",
      inlineSize: "10rem",
      blockSize: "2.5rem",
    },
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
  },
});
