import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  gap: `var(${cssVars.space[2]})`,
  minInlineSize: 0,
});

export const label = style({
  color: `var(${cssVars.color.text})`,
  fontWeight: 600,
  lineHeight: 1.25,
  selectors: {
    [`${root}[data-disabled='true'] &`]: {
      color: `var(${cssVars.color.textMuted})`,
    },
  },
});

export const requiredIndicator = style({
  color: `var(${cssVars.color.danger})`,
});

export const description = style({
  color: `var(${cssVars.color.textMuted})`,
  fontSize: "0.875rem",
  lineHeight: 1.5,
  margin: 0,
  selectors: {
    [`${root}[data-disabled='true'] &`]: {
      color: `var(${cssVars.color.textSubtle})`,
    },
  },
});

export const error = style({
  color: `var(${cssVars.color.danger})`,
  fontSize: "0.875rem",
  lineHeight: 1.5,
  margin: 0,
});
