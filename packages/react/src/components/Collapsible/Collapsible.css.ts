import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  selectors: {
    "&[data-a='plain']": { background: "transparent", border: 0 },
  },
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
});

export const trigger = style({
  padding: "var(--flux-space-4)",
  fontSize: "var(--flux-font-body-size)",
  cursor: "pointer",
  fontWeight: 600,
  selectors: {
    [`${root}[data-d='compact'] &`]: {
      padding: "var(--flux-space-3)",
      fontSize: "var(--flux-font-caption)",
    },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
  },
});

export const content = style({
  padding: "0 var(--flux-space-4) var(--flux-space-4)",
  selectors: {
    [`${root}[data-d='compact'] &`]: {
      padding: "0 var(--flux-space-3) var(--flux-space-3)",
    },
    "&[data-p='none']": { padding: 0 },
  },
});
