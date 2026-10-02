import Preview from "./date-time-picker.preview.js";
import code from "./date-time-picker.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "value / defaultValue",
      "string",
      "Local civil datetime. Native minute precision is YYYY-MM-DDTHH:mm.",
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
    "The serialized value deliberately has no timezone offset and is not an instant.",
    "For timezone-aware scheduling, convert at the application/domain boundary rather than inside this component.",
  ],
} satisfies ComponentExample;
