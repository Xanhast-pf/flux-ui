import Preview from "./switch.preview.js";
import code from "./switch.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "The label must remain constant when a switch changes state. Use description text to explain the result.",
    "The real input owns keyboard, form submission, defaultChecked and reset semantics. There is no mixed state.",
    "Forced-colors mode restores the native checkbox indicator while retaining the switch role.",
  ],
  props: [
    [
      "checked / defaultChecked",
      "boolean",
      "Controlled value or native initial checked state.",
    ],
    [
      "onCheckedChange",
      "(checked, event) => void",
      "Runs after onChange unless the native event is canceled.",
    ],
    [
      "Native props",
      "input attributes",
      "name, value, form, required, disabled, ref and styling pass through.",
    ],
  ],
} satisfies ComponentExample;
