import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  fontSize: "var(--flux-font-body-size)",
  vars: {
    "--f-f-h": "initial",
    "--f-f-d": "initial",
    "--f-f-label": "var(--flux-color-text)",
    "--f-f-description": "var(--flux-color-text-muted)",
  },
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": {
      display: "none !important",
    },
    "&[data-x]": {
      vars: {
        "--f-f-label": "var(--flux-color-text-muted)",
        "--f-f-description": "var(--flux-color-text-subtle)",
      },
    },
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
  color: "var(--f-f-label)",
  fontWeight: 600,
  lineHeight: 1.25,
});

export const requiredIndicator = style({
  color: `var(${cssVars.color.danger})`,
});

export const description = style({
  color: "var(--f-f-description)",
  fontSize: "var(--f-f-d, 0.875rem)",
  lineHeight: 1.5,
  margin: 0,
});

export const error = style({
  color: `var(${cssVars.color.danger})`,
  fontSize: "var(--f-f-d, 0.875rem)",
  lineHeight: 1.5,
  margin: 0,
});
