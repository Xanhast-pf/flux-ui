import Preview from "./date-picker.preview.js";
import code from "./date-picker.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "value / defaultValue",
      "string",
      "ISO civil date (YYYY-MM-DD). Native controlled/uncontrolled semantics are preserved.",
    ],
    [
      "onValueChange",
      "(value: string, event) => void",
      "Convenience callback after native onChange. Prevent the change event to suppress it.",
    ],
    [
      "min / max / step",
      "native input props",
      "Delegated to browser constraint validation and picker behavior.",
    ],
  ],
  notes: [
    "Parsing, form reset, validity, keyboard behavior and the picker UI remain browser-owned.",
    "A civil date has no timezone or instant semantics.",
    "Compose with Field for labels, descriptions, required state and validation messages.",
  ],
} satisfies ComponentExample;
