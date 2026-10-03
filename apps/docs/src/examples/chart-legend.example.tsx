import Preview from "./chart-legend.preview.js";
import code from "./chart-legend.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "ChartLegend is an optional HTML wrapper for Chart, PieChart and ScatterChart. The chart renderers do not import or require it.",
    "By default legend items are static labels. toggleVisibility promotes them to native buttons and filters matching chart IDs through lightweight composition context.",
    "Use hiddenIds/onHiddenIdsChange when application state must own visibility; the example keeps that state controlled while a nested ChartTooltip continues to work from the same chart data.",
    "placement controls where the legend sits around its child; direction controls the legend list independently. onItemClick can observe or cancel an interactive legend action.",
    "Chart keyboard inspection remains complete without ChartLegend, so the legend is never the only accessible route to a series.",
  ],
  props: [
    [
      "items",
      "readonly ChartLegendItem[]",
      "Stable IDs, labels and optional Flux chart tones.",
    ],
    [
      "placement",
      "top | bottom | start | end",
      "Legend placement around the wrapped chart.",
    ],
    [
      "direction",
      "horizontal | vertical",
      "Legend list direction; inferred from placement when omitted.",
    ],
    [
      "toggleVisibility",
      "boolean",
      "Turns legend items into visibility buttons.",
    ],
    [
      "hiddenIds / defaultHiddenIds",
      "readonly string[]",
      "Controlled or initial hidden chart IDs.",
    ],
    [
      "onHiddenIdsChange",
      "(ids) => void",
      "Visibility callback for owner coordination.",
    ],
  ],
} satisfies ComponentExample;
