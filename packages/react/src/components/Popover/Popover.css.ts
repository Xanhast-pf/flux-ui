import { style } from "@vanilla-extract/css";
import { floatingSurface } from "../../internal/floating.css.js";
export const popup = style([
  floatingSurface,
  {
    padding: "var(--flux-space-4)",
    minInlineSize: "min(16rem, calc(100vw - 1rem))",
  },
]);
