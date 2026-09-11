import Preview from "./inline.preview.js";
import code from "./inline.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Horizontal groups that align, distribute, and wrap content.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    ["gap", "Responsive token gap", "Spacing between children."],
    [
      "align / justify / wrap",
      "Layout props",
      "Align, distribute or wrap a row.",
    ],
  ],
} satisfies ComponentExample;
