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
