import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

const actionBase = {
  minHeight: `var(${cssVars.control.md})`,
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
  cursor: "pointer",
  font: "inherit",
  paddingInline: `var(${cssVars.space[4]})`,
  selectors: {
    "&:hover": { background: `var(${cssVars.color.surfaceSubtle})` },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
  },
} as const;

export const modalAction = style(actionBase);

export const title = style({
  margin: 0,
  fontSize: "1.25rem",
  lineHeight: 1.2,
});

export const description = style({
  marginBlock: `var(${cssVars.space[2]}) var(${cssVars.space[5]})`,
  color: `var(${cssVars.color.textMuted})`,
  lineHeight: 1.5,
});
