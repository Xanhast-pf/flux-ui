import Preview from "./chart.preview.js";
import code from "./chart.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Line, area and grouped bar renderers share semantic Flux tones and one path per series.",
    "Source x values must be finite and strictly increasing. A null y marks a real gap.",
    "Use the labelled data cursor and arrow keys to inspect every source sample. Rendering reduction does not replace the source.",
    "Bounded SVG renderer: up to 32 series and 200,000 input samples; default 512 displayed samples per series. Bar categories are never silently discarded.",
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
      "Rendering style without changing source data.",
    ],
    [
      "maxPoints",
      "number",
      "Per-series render budget; source inspection stays complete.",
    ],
  ],
} satisfies ComponentExample;
