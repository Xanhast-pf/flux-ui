import Preview from "./visually-hidden.preview.js";
import code from "./visually-hidden.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  props: [
    [
      "children",
      "ReactNode",
      "Text remains available to assistive technology.",
    ],
    [
      "Native props",
      "span attributes",
      "Refs, IDs, className and style remain available.",
    ],
  ],
  notes: [
    "Do not use this to hide interactive controls or other focusable descendants.",
    "Unlike hidden or aria-hidden, this preserves text in the accessibility tree.",
    "Use IconButton with aria-label for the ordinary icon-action path; hidden text is useful in richer compositions.",
  ],
} satisfies ComponentExample;
