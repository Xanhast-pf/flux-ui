import type { ComponentExample } from "../lib/examples.js";
import Preview from "./heading.preview.js";
import code from "./heading.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "The required level controls h1–h6 semantics. Size never chooses the document outline.",
    "Choose a level that fits the surrounding page; a preview inside documentation is not a second page title.",
  ],
  props: [
    ["level", "1 | 2 | 3 | 4 | 5 | 6", "Required document-outline level."],
    [
      "size",
      "sm | md | lg | xl | display",
      "Independent tokenized visual scale.",
    ],
    [
      "Native heading props",
      "HTMLHeadingElement",
      "Native attributes and ref are preserved.",
    ],
  ],
} satisfies ComponentExample;
