import Preview from "./number-field.preview.js";
import code from "./number-field.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Part of the Input family: Input type=number is sufficient for native string events; NumberField adds only the numeric callback contract. Place it directly inside InputGroup.Root for prefixes/suffixes.",
    "A native number input: form participation, min/max validity and steppers stay with the platform.",
    "onValueChange receives a number or null for an empty/invalid numeric value; onChange still receives the native event.",
  ],
  props: [
    [
      "onValueChange",
      "(number | null, event) => void",
      "Native numeric change callback.",
    ],
    [
      "Native input props",
      "value, min, max, step, name, ref",
      "Normal platform form contract.",
    ],
  ],
} satisfies ComponentExample;
