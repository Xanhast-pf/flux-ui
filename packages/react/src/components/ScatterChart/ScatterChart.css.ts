import { style } from "@vanilla-extract/css";

export {
  axis,
  caption,
  chart,
  detail,
  gridLine,
  inspector,
  legend,
  legendButton,
  seriesStyle,
  svg,
} from "../Chart/Chart.css.js";

export const points = style({
  fill: "currentColor",
  opacity: 0.7,
  selectors: {
    "&[data-active='true']": { opacity: 1 },
  },
});

export const activePoint = style({
  fill: "var(--flux-color-surface)",
  stroke: "currentColor",
  strokeWidth: 3,
  pointerEvents: "none",
  "@media": {
    "(forced-colors: active)": {
      fill: "Canvas",
      stroke: "Highlight",
    },
  },
});
