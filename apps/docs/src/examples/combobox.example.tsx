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
    "Options require unique stable values. Contiguous options with the same group render as a semantic listbox group without changing keyboard order. Labels are shown to users; the optional hidden named input submits only a committed, enabled value.",
    "Typing clears the committed value and filters the local options. Non-empty uncommitted text fails native constraint validation.",
    "The popup does not move DOM focus from the input. value/query can be owned independently; query=null means show the committed option label. loading exposes aria-busy plus a status message but does not own fetching.",
    "This remains single-select with string keys. Free text, object identity, custom option rendering and multiple selection are intentionally separate problems.",
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
    [
      "query / defaultQuery / onQueryChange",
      "string | null / callback",
      "Controlled or initial filter text. null returns the input to the committed option label.",
    ],
    [
      "loading / loadingMessage",
      "boolean / string",
      "Marks the listbox busy and announces application-owned async work.",
    ],
    ["name", "string", "Submit the committed key through a hidden form input."],
  ],
} satisfies ComponentExample;
