import type { ComponentExample } from "../lib/examples.js";
import Preview, { HeadingSizeScale } from "./heading.preview.js";
import code from "./heading.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  previewTitle: "Semantic level vs visual size",
  previewDescription:
    "Document outline level and visual scale are intentionally independent.",
  variations: [
    {
      title: "Size scale",
      description:
        "One semantic heading level shown across the visual size tokens.",
      Preview: HeadingSizeScale,
    },
  ],
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
