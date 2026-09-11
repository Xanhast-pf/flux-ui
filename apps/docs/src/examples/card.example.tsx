import Preview from "./card.preview.js";
import code from "./card.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Card is a surface div, not an implicit button, heading or landmark.",
    "Compose real headings, buttons and links inside. Add section or article semantics at the application layer when needed.",
  ],
  props: [
    [
      "children",
      "ReactNode",
      "Your structure and content; no header/footer prop configuration.",
    ],
    [
      "Native props",
      "div attributes",
      "Ref, className, style and data attributes are preserved.",
    ],
  ],
} satisfies ComponentExample;
