import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
import { toggle } from "../Toggle/Toggle.css.js";
export const root = style({
  display: "inline-flex",
  flexWrap: "wrap",
  gap: `var(${cssVars.space[1]})`,
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
    "&[data-o='vertical']": {
      flexDirection: "column",
      alignItems: "stretch",
    },
  },
});
export const item = toggle;
