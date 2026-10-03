import { style } from "@vanilla-extract/css";

export const slice = style({
  stroke: "var(--flux-color-surface)",
  strokeWidth: 2,
  transition: "opacity var(--flux-motion-fast) var(--flux-motion-easing)",
  selectors: {
    "&[data-active='false']": { opacity: 0.7 },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
    "(forced-colors: active)": {
      stroke: "Canvas",
      strokeWidth: 3,
    },
  },
});
