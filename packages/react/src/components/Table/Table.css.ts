import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const table = style({
  inlineSize: "100%",
  borderCollapse: "collapse",
  fontSize: "1rem",
  color: `var(${cssVars.color.text})`,
});
export const caption = style({
  textAlign: "start",
  paddingBlock: `var(${cssVars.space[3]})`,
  color: `var(${cssVars.color.textMuted})`,
});
export const row = style({
  borderBlockEnd: `0.0625rem solid var(${cssVars.color.border})`,
});
export const cell = style({
  textAlign: "start",
  verticalAlign: "top",
  padding: `var(${cssVars.space[3]}) var(${cssVars.space[4]})`,
});
