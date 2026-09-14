import Preview from "./tabs.preview.js";
import code from "./tabs.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Keyboard-accessible switching between related panels.",
    "Use native attributes, className, style and composition for customization.",
    "Uncontrolled tabs recover the nearest available selection when the selected tab is removed, disabled, hidden or inert. Selection does not steal focus from unrelated controls.",
    "A controlled owner must reconcile removed values. Flux keeps an available keyboard entry but does not invent a new controlled selection or display a mismatched panel.",
    "Use hidden/inert or native disabled state for unavailable items. CSS-only visibility changes are not the collection lifecycle contract.",
  ],
  props: [
    [
      "Root",
      "value / defaultValue / onValueChange",
      "Selection state; an initial value is required.",
    ],
    [
      "Root.orientation",
      "horizontal | vertical",
      "Layout and keyboard navigation direction.",
    ],
    ["List", "activateOnFocus / loopFocus", "Roving-focus behavior."],
    ["Tab / Panel", "value: string", "Associate each trigger with its panel."],
  ],
} satisfies ComponentExample;
