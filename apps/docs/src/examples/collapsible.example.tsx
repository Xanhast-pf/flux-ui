import Preview from "./collapsible.preview.js";
import code from "./collapsible.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Trigger renders summary and must be the first direct child of Root (details).",
    "Native Enter/Space behavior, open, name and onToggle remain available. This is a disclosure, not a custom APG accordion with arrow navigation.",
    "Content stays in the DOM while closed; do not use this as a promise of lazy mounting expensive children.",
  ],
  props: [
    ["Root", "details props", "Native open, name, onToggle, ref and styling."],
    [
      "Trigger",
      "summary props",
      "First direct child; supply meaningful visible text.",
    ],
    ["Content", "div props", "Body content inside the details element."],
  ],
} satisfies ComponentExample;
