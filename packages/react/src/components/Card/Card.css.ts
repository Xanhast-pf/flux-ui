import { style } from "@vanilla-extract/css";
import { surfaceBase } from "../../internal/surface.css.js";

// Defaults are static and low-specificity; consumer classes and explicit props win.
export const card = style([
  surfaceBase,
  { selectors: { ":where(&)": { padding: "var(--flux-space-4)" } } },
]);
