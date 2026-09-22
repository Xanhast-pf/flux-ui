import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const footer = style({
  boxSizing: "border-box",
  inlineSize: "100%",
  minInlineSize: 0,
  flexShrink: 0,
  marginBlockStart: "auto",
  paddingBlock: `var(${cssVars.space[4]})`,
  borderBlockStart: `0.0625rem solid var(${cssVars.color.border})`,
  color: `var(${cssVars.color.text})`,
});
