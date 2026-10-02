import Preview from "./time-picker.preview.js";
import code from "./time-picker.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "value / defaultValue",
      "string",
      "Local civil time. Native minute precision is HH:mm; finer precision remains native when step requests it.",
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
    "The value is a local civil time, not a timezone-aware instant.",
    "Compose with Field for labels, descriptions, required state and validation messages.",
  ],
} satisfies ComponentExample;
