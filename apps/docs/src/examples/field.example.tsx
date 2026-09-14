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
    "Descriptions and errors inside custom helpers register after rendering. For an initial server-rendered relationship, use Root description/error slots or directly discoverable Description/Error children.",
    "Use one description and one error per field: choose the Root slot or the matching compound part, not both. Controls must forward native attributes and refs.",
  ],
  props: [
    [
      "Root",
      "invalid / required / disabled / controlId / description / error",
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
