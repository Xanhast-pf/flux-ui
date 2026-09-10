import { CheckboxDemo as Preview } from "../demos/CheckboxDemo.js";
import code from "../demos/CheckboxDemo.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Native checked and mixed states, keyboard behavior, and form submission.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    [
      "checked / defaultChecked",
      "boolean",
      "Controlled checked state or native initial state.",
    ],
    [
      "indeterminate",
      "boolean",
      "Mixed visual state, independent of form submission.",
    ],
    [
      "onCheckedChange",
      "(checked, event) => void",
      "Optional convenience callback after onChange.",
    ],
  ],
} satisfies ComponentExample;
