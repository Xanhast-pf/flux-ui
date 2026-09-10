import Preview from "./textarea.preview.js";
import code from "./textarea.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Native multi-line text entry with Flux styling and Field composition.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    ["rows / cols", "number", "Native visible size hints."],
    [
      "value / defaultValue / onChange",
      "Native textarea props",
      "Controlled or browser-owned text.",
    ],
    [
      "Native props",
      "textarea attributes",
      "Required, disabled, readOnly, form, ref and styling.",
    ],
  ],
} satisfies ComponentExample;
