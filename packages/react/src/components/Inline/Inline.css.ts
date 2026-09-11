import { style } from "@vanilla-extract/css";
import { flexLayout } from "../../internal/flexLayout.css.js";

export const inline = style([
  flexLayout,
  { flexDirection: "row", alignItems: "center" },
]);
