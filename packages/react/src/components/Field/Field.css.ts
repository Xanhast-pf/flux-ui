import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  fontSize: "var(--flux-font-body-size)",
  vars: {
    "--f-f-h": "initial",
    "--f-f-d": "initial",
  },
  selectors: {
    "&[data-d='compact']": {
      gap: "var(--flux-space-1)",
      fontSize: "var(--flux-font-caption)",
      vars: {
        "--f-f-h": "var(--flux-control-sm)",
        "--f-f-d": "var(--flux-font-caption)",
      },
    },
  },
  display: "grid",
  gap: `var(${cssVars.space[2]})`,
  minInlineSize: 0,
});

export const label = style({
  color: `var(${cssVars.color.text})`,
  fontWeight: 600,
  lineHeight: 1.25,
  selectors: {
    [`${root}[data-x] &`]: {
      color: `var(${cssVars.color.textMuted})`,
    },
  },
});

export const requiredIndicator = style({
  color: `var(${cssVars.color.danger})`,
});

export const description = style({
  color: `var(${cssVars.color.textMuted})`,
  fontSize: "var(--f-f-d, 0.875rem)",
  lineHeight: 1.5,
  margin: 0,
  selectors: {
    [`${root}[data-x] &`]: {
      color: `var(${cssVars.color.textSubtle})`,
    },
  },
});

export const error = style({
  color: `var(${cssVars.color.danger})`,
  fontSize: "var(--f-f-d, 0.875rem)",
  lineHeight: 1.5,
  margin: 0,
});
