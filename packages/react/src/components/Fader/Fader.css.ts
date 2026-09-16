import { style } from "@vanilla-extract/css";
/** Compatibility skin; orientation and length now belong to Slider. */
export const fader = style({
  selectors: {
    "&&": { blockSize: "2.5rem" },
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
  },
});
