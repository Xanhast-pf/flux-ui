import Preview from "./rating.preview.js";
import code from "./rating.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Rating uses native same-name radio inputs, so arrow-key behavior, required validation, form submission and reset stay structural.",
    "Use step={0.5} for half-star precision; the default remains whole-star selection. Pointer users can press and drag across the stars to scrub the value.",
    "Use readOnly for a non-interactive display; named read-only ratings still submit their current value.",
  ],
  props: [
    [
      "value / defaultValue",
      "number | null",
      "Controlled or uncontrolled selection aligned to step.",
    ],
    ["onValueChange", "(value, event) => void", "Reports a selected rating."],
    ["max", "1..10", "Number of stars; defaults to 5."],
    ["step", "1 | 0.5", "Selection precision; defaults to 1."],
    ["name", "string", "Native form field/radio-group name."],
    ["required", "boolean", "Uses native radio-group constraint validation."],
    ["readOnly", "boolean", "Renders a non-interactive rating presentation."],
    [
      "getItemLabel",
      "(value, max) => string",
      "Custom accessible option labels.",
    ],
  ],
} satisfies ComponentExample;
