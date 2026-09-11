import type { ComponentExample } from "../lib/examples.js";
import Preview from "./page-header.preview.js";
import code from "./page-header.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "PageHeader renders a native header and exactly one explicitly leveled Heading. A nested section should usually select level 2 or 3.",
    "Use normal children for introductions and actions for the action area; no hidden page-specific component library is required.",
  ],
  props: [
    [
      "title / eyebrow",
      "ReactNode",
      "Required heading and optional category label.",
    ],
    ["level", "1 | 2 | 3", "Heading level, defaults 1."],
    [
      "children / actions",
      "ReactNode",
      "Introduction content and ordinary composed actions.",
    ],
  ],
} satisfies ComponentExample;
