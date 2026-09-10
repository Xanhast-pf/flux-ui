import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const root = style({
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
});
export const trigger = style({
  padding: `var(${cssVars.space[4]})`,
  cursor: "pointer",
  fontWeight: 600,
  selectors: {
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
  },
});
export const content = style({
  padding: `0 var(${cssVars.space[4]}) var(${cssVars.space[4]})`,
});
