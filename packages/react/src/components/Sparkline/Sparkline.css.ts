import { style } from "@vanilla-extract/css";
export const sparkline = style({
  display: "block",
  inlineSize: "100%",
  maxBlockSize: "4rem",
  color: "var(--flux-color-accent)",
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
  },
});
