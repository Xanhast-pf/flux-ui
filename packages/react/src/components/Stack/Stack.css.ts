import { style } from "@vanilla-extract/css";
import { flexLayout } from "../../internal/flexLayout.css.js";

export const stack = style([
  flexLayout,
  { flexDirection: "column", alignItems: "stretch" },
]);
