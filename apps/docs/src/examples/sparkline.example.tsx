import Preview from "./sparkline.preview.js";
import code from "./sparkline.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Trend rendering is not a replacement for data access. Exposed sparklines require label; use aria-hidden when an equivalent nearby summary already carries the accessible meaning.",
    "Null values split paths; flat data is centered. The miniature API is bounded to 2,048 input samples.",
  ],
  props: [
    [
      "values",
      "readonly (number | null)[]",
      "Small source series with optional gaps.",
    ],
    [
      "label / aria-hidden",
      "string / boolean",
      "Exposed sparklines require label; aria-hidden is the decorative alternative when nearby accessible text already summarizes the trend.",
    ],
  ],
} satisfies ComponentExample;
