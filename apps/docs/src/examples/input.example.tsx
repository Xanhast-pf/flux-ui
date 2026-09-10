import Preview from "./input.preview.js";
import code from "./input.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Native text-entry semantics with Flux styling and escape hatches.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    [
      "type",
      "Text-entry input types",
      "Native text-entry control; numeric size remains native.",
    ],
    [
      "value / defaultValue / onChange",
      "Native input props",
      "Controlled or browser-owned value.",
    ],
    [
      "Native props",
      "input attributes",
      "Required, disabled, readOnly, form, ARIA, ref and styling.",
    ],
  ],
} satisfies ComponentExample;
