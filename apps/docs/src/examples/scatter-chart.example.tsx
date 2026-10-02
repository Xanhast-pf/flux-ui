import Preview from "./scatter-chart.preview.js";
import code from "./scatter-chart.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "series",
      "readonly ScatterChartSeries[]",
      "Unique labeled series of finite x/y points. Source order is the keyboard inspection order.",
    ],
    [
      "maxPoints",
      "number",
      "Maximum rendered samples per series. Defaults to 512; source points remain keyboard inspectable.",
    ],
    [
      "formatX / formatY",
      "(value: number) => string",
      "Format inspector and axis values without changing numeric domains.",
    ],
  ],
  notes: [
    "ScatterChart uses one SVG path per series rather than one DOM node per data point.",
    "Legend selection, Arrow/Home/End inspection, pointer inspection and accessible value text follow the existing Chart interaction language.",
    "Large sources should still be windowed or aggregated upstream when they exceed the documented source budget.",
  ],
} satisfies ComponentExample;
