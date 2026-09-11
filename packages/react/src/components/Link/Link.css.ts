import { style } from "@vanilla-extract/css";

export const link = style({
  selectors: {
    ":where(&)": {
      color: "var(--flux-color-accent)",
      textUnderlineOffset: "0.2em",
      borderRadius: "var(--flux-radius-sm)",
    },
    "&:focus-visible": {
      outline: "0.125rem solid var(--flux-color-focus)",
      outlineOffset: "0.125rem",
    },
    "&[aria-disabled='true']": { opacity: 0.6, cursor: "not-allowed" },
    "&:not([data-variant]):hover": { textDecorationThickness: "0.125rem" },
    "&[data-variant]": { textDecoration: "none" },
    "&:where([data-variant='navigation'])": {
      display: "flex",
      alignItems: "center",
      gap: "var(--flux-space-2)",
      padding: "var(--flux-space-2) var(--flux-space-3)",
      color: "var(--flux-color-text-muted)",
    },
    "&:where([data-variant='navigation']):hover": {
      background: "var(--flux-color-surface-subtle)",
      color: "var(--flux-color-text)",
    },
    "&:where([data-variant='navigation'])[aria-current]:not([aria-current='false'])":
      {
        background: "var(--flux-color-accent-soft)",
        color: "var(--flux-color-text)",
        boxShadow: "inset 0.125rem 0 var(--flux-color-accent)",
      },
  },
  "@media": {
    "(forced-colors: active)": {
      selectors: {
        "&:where([data-variant='navigation'])[aria-current]:not([aria-current='false'])":
          { outline: "0.125rem solid Highlight" },
      },
    },
  },
});
