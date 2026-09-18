import type { ComponentExample } from "../lib/examples.js";
import Preview from "./text.preview.js";
import code from "./text.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Semantic element and visual role are independent. A large number is not automatically a heading.",
    "Inline text inherits its surrounding size unless a variant is supplied; this preserves text nested inside headings.",
    "Use Field.Label for form labels, not Text.",
  ],
  props: [
    [
      "as",
      "TextElement",
      "Native inline or text semantics, including time/dateTime.",
    ],
    [
      "variant",
      "body | caption | label | eyebrow | lead | metric | display",
      "Tokenized visual role, independent of native element.",
    ],
    [
      "tone / weight / align / numeric",
      "Semantic variants",
      "Color, weight, alignment and tabular numbers.",
    ],
    [
      "italic / decoration",
      "boolean; none | underline | line-through",
      "Finite text emphasis without changing native semantics.",
    ],
  ],
} satisfies ComponentExample;
