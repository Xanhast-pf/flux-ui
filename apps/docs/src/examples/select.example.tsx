import Preview from "./select.preview.js";
import code from "./select.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Use a visible label or an accessible name. Field.Control wires labels and descriptions automatically.",
    "Native options, optgroup, multiple, size, disabled options and form attributes stay available.",
    "This is a native select, not a searchable combobox or a custom popup menu.",
  ],
  props: [
    [
      "value / defaultValue",
      "Native select value",
      "Use onChange with value; use defaultValue for browser-owned selection.",
    ],
    [
      "multiple / size",
      "boolean / number",
      "Opt into native multiple selection or a listbox.",
    ],
    [
      "children",
      "option / optgroup",
      "Compose native choices, including disabled options.",
    ],
  ],
} satisfies ComponentExample;
