import { style } from "@vanilla-extract/css";
import { input } from "../Input/Input.css.js";
export const numberField = style([
  input,
  { fontVariantNumeric: "tabular-nums" },
]);
