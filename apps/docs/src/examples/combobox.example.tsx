import Preview from "./combobox.preview.js";
import code from "./combobox.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Combobox is searchable selection with autocomplete. It commits an existing option key; it is not a free-text search input and unmatched text cannot be submitted as a new option.",
    "For arbitrary search text use Input type=search. The Combobox name and committed-value API remain unchanged.",
    "Options require unique stable values. Labels are shown to users; the optional hidden named input submits only a committed, enabled value.",
    "Typing clears the committed value and filters the local options. Non-empty uncommitted text fails native constraint validation.",
    "The popup does not move DOM focus from the input. Controlled owners remain authoritative. This is single-select, not async search or multiple selection.",
  ],
  props: [
    [
      "options",
      "readonly ComboboxOption[]",
      "Local value/label choices; unique values are required.",
    ],
    [
      "value / defaultValue",
      "string | null",
      "Controlled or initial committed key.",
    ],
    [
      "onValueChange",
      "(value: string | null) => void",
      "Selection and explicit clearing.",
    ],
    ["name", "string", "Submit the committed key through a hidden form input."],
  ],
} satisfies ComponentExample;
