import Preview from "./field.preview.js";
import code from "./field.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Accessible labels, descriptions, errors, and shared form-control state.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    [
      "Root",
      "invalid / required / disabled / controlId",
      "Owns state and deterministic control identity.",
    ],
    [
      "Control",
      "One compatible React element",
      "DOM-less enhancement; merges described-by IDs.",
    ],
    [
      "Label / Description / Error",
      "Compound parts",
      "Labeling, descriptions, and conditional invalid-state messages.",
    ],
  ],
} satisfies ComponentExample;
