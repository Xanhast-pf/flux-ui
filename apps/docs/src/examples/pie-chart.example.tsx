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
      "Formats inspector values without changing the numeric data model.",
    ],
  ],
  notes: [
    "PieChart is a specialist family rather than another Chart.type value because its data model is categorical parts-of-a-whole.",
    "Legend buttons and the data cursor share one active slice. Arrow keys inspect slices; Home/End reach endpoints.",
    "The SVG is decorative; the slider-style inspector carries the accessible value text.",
  ],
} satisfies ComponentExample;
