import { RadioGroupDemo as Preview } from "../demos/RadioGroupDemo.js";
import code from "../demos/RadioGroupDemo.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Native mutually-exclusive selection with fieldset semantics, keyboard behavior, and form submission.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    [
      "Root",
      "value / defaultValue / onValueChange",
      "Controlled or browser-owned radio selection.",
    ],
    [
      "name / required / disabled / invalid",
      "Group state",
      "Shared name, native validation and visual group feedback.",
    ],
    [
      "Legend / Item",
      "legend / radio input",
      "Keep Legend as a direct child. Give each Item a unique value and label.",
    ],
  ],
} satisfies ComponentExample;
