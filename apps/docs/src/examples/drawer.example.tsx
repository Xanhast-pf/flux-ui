import Preview from "./drawer.preview.js";
import code from "./drawer.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Edge-aligned modal panel for navigation and secondary workflows.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    [
      "Root",
      "open / defaultOpen / onOpenChange",
      "Shared modal behavior with Dialog.",
    ],
    ["Popup.side", "left | right | top | bottom", "Drawer placement."],
    [
      "Trigger / Close / Title / Description",
      "Compound parts",
      "Open, close and label the modal.",
    ],
  ],
} satisfies ComponentExample;
