import Preview from "./pie-chart.preview.js";
import code from "./pie-chart.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "data",
      "readonly PieChartDatum[]",
      "Unique labeled non-negative values. A non-empty chart must have a positive total.",
    ],
    [
      "maxSlices",
      "number",
      "Hard render budget. Defaults to 64; aggregate small categories upstream instead of creating unreadable slices.",
    ],
    [
      "formatValue",
      "(value: number) => string",
      "Formats inspector and ChartTooltip values without changing the numeric data model.",
    ],
  ],
  notes: [
    "PieChart is only the categorical visualization and accessible inspector; visible titles, surfaces, legends and tooltips are composition.",
    "The example combines toggleable ChartLegend visibility with a click ChartTooltip: hidden slices leave the visible total, percentages recalculate, and formatValue flows into the projected tooltip value.",
    "ChartTooltip can use hover or click. The SVG and tooltip are visual projections; the slider-style chart inspector remains the accessible value owner.",
    "Arrow keys inspect slices; Home/End reach endpoints even when no legend or tooltip is composed.",
  ],
} satisfies ComponentExample;
