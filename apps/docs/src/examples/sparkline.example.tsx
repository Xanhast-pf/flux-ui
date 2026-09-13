import Preview from "./sparkline.preview.js";
import code from "./sparkline.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Decorative trend rendering is not a replacement for data access. Supply a meaningful accessible label or an equivalent nearby summary.",
    "Null values split paths; flat data is centered. The miniature API is bounded to 2,048 input samples.",
  ],
  props: [
    [
      "values",
      "readonly (number | null)[]",
      "Small source series with optional gaps.",
    ],
    ["label", "string", "Accessible trend description."],
  ],
} satisfies ComponentExample;
