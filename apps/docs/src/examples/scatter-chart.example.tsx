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
      "Format inspector, axes and ChartTooltip values without changing numeric domains.",
    ],
  ],
  notes: [
    "ScatterChart is only the bounded visualization and accessible inspector; it renders no Card, title, legend or tooltip by itself.",
    "The example combines toggleable ChartLegend visibility with a hover ChartTooltip; formatX/formatY are shared by the inspector, axes and projected tooltip values.",
    "Left/Right inspect source points, Up/Down move between series, and Home/End reach endpoints, so keyboard access never depends on the legend.",
    "ScatterChart uses one SVG path per series rather than one DOM node per data point. Large sources should still be windowed or aggregated upstream beyond the documented source budget.",
  ],
} satisfies ComponentExample;
