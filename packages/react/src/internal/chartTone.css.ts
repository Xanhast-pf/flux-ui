import { style } from "@vanilla-extract/css";

export const chartTone = style({
  color: "var(--flux-color-accent)",
  selectors: {
    "&[data-tone='info']": { color: "var(--flux-color-info)" },
    "&[data-tone='success']": { color: "var(--flux-color-success)" },
    "&[data-tone='warning']": { color: "var(--flux-color-warning)" },
    "&[data-tone='danger']": { color: "var(--flux-color-danger)" },
  },
});
