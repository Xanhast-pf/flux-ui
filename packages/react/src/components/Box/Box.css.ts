import { style } from "@vanilla-extract/css";
import { surfaceBase } from "../../internal/surface.css.js";

export const box = style([
  surfaceBase,
  {
    selectors: {
      "&[hidden]:not([hidden='until-found' i])": {
        display: "none !important",
      },
    },
  },
]);
