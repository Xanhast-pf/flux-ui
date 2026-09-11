import type { ComponentExample } from "../lib/examples.js";
import Preview from "./meter.preview.js";
import code from "./meter.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "A meter describes a known bounded measurement, not task progress. Use Progress for completion.",
    "value, min and max must be finite; max must exceed min. Unknown measurements are rendered separately by the caller.",
    "Supply an accessible name or use aria-hidden when the same value is already presented as accessible text.",
  ],
  props: [
    ["value", "number", "Required finite measurement."],
    ["min / max", "number", "Finite bounds; defaults 0 and 1."],
    [
      "low / high / optimum",
      "Native meter props",
      "Browser-owned ranges and native semantics.",
    ],
  ],
} satisfies ComponentExample;
