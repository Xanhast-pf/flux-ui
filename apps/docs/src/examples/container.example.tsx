import Preview from "./container.preview.js";
import code from "./container.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Centered content width with Flux spacing and named size constraints.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    [
      "size",
      "sm | md | lg | xl | full",
      "Named width constraint with responsive page gutters.",
    ],
    [
      "Native props",
      "div attributes",
      "Children, ref, className, style and data attributes.",
    ],
  ],
} satisfies ComponentExample;
