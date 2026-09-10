import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
import { toggle } from "../Toggle/Toggle.css.js";
export const root = style({
  display: "inline-flex",
  flexWrap: "wrap",
  gap: `var(${cssVars.space[1]})`,
  selectors: {
    "&[data-orientation='vertical']": {
      flexDirection: "column",
      alignItems: "stretch",
    },
  },
});
export const item = style([toggle]);
