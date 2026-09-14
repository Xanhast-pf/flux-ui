import { style } from "@vanilla-extract/css";
import { floatingSurface } from "../../internal/floating.css.js";
export const tooltip = style([
  floatingSurface,
  {
    padding: "var(--flux-space-2) var(--flux-space-3)",
    maxInlineSize: "min(20rem, calc(100vw - 1rem))",
    fontSize: "var(--flux-font-caption)",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },
]);
