import Preview from "./chart.preview.js";
import code from "./chart.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Chart is only the visualization and accessible data inspector. It does not render a Card surface, visible title, legend, source-count prose or tooltip.",
    "Compose Card, Heading, Text or any other layout around a chart normally. The chart's label and description remain accessible metadata rather than visible chrome.",
    "ChartLegend can wrap Chart, PieChart or ScatterChart. It owns legend layout and optional series/slice visibility; toggleVisibility is opt-in and applications can control hiddenIds.",
    "ChartTooltip can wrap any chart and projects normalized chart data on hover (default) or click. Direct series hits show and emphasize that item; plot-background inspection shows all visible values nearest the cursor's x bucket.",
    "Keyboard inspection does not depend on a legend: Left/Right inspect points, Up/Down move between series, and Home/End reach endpoints.",
    "Source x values must be finite and strictly increasing. A null y marks a real gap. Rendering stays bounded without replacing source inspection.",
  ],
  props: [
    [
      "series",
      "readonly ChartSeries[]",
      "Stable series IDs and sorted point arrays.",
    ],
    [
      "type",
      "line | area | bar",
      "Rendering style without adding separate chart chrome.",
    ],
    [
      "maxPoints",
      "number",
      "Per-series render budget; source inspection stays complete.",
    ],
    [
      "ChartLegend",
      "items, placement, direction, toggleVisibility, hiddenIds",
      "Optional HTML legend wrapper shared by all Flux chart families.",
    ],
    [
      "ChartTooltip",
      "trigger=hover | click, renderContent",
      "Optional data-tooltip wrapper shared by all Flux chart families.",
    ],
  ],
} satisfies ComponentExample;
