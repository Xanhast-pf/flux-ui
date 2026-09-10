import Preview from "./toggle-group.preview.js";
import code from "./toggle-group.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  props: [
    [
      "Root.type",
      "single | multiple",
      "Single values are string | null; multiple values are readonly string[].",
    ],
    [
      "value / defaultValue / onValueChange",
      "mode-specific values",
      "Controlled or uncontrolled selection. Item values must be unique.",
    ],
    [
      "orientation / loopFocus / disabled",
      "horizontal | vertical; boolean",
      "Arrow axis, edge behavior and group-level disabled state.",
    ],
    [
      "Item.value",
      "string",
      "A native toggle button. Every item requires a stable value and label.",
    ],
  ],
  notes: [
    "One enabled item is a tab stop after hydration. Arrows, Home and End move focus without changing selection; RTL horizontal navigation is respected.",
    "Single selection can be cleared by pressing the selected item. Use RadioGroup for a required mutually exclusive form choice.",
    "Each group owns its own collection, including when groups are nested. Disabled and hidden items are skipped.",
    "Do not nest another roving widget inside an item or use this as a form-submission control.",
  ],
} satisfies ComponentExample;
