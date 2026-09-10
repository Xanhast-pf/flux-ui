import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const card = style({
  minInlineSize: 0,
  padding: `var(${cssVars.space[4]})`,
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: `var(${cssVars.radius.lg})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
});
