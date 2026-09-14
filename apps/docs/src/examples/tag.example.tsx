import Preview from "./tag.preview.js";
import code from "./tag.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "A removable tag requires both onRemove and a specific removeLabel.",
    "The owner removes the item and manages focus after removal; Tag does not invent collection or arrow-key behavior.",
    "Use Badge for a passive status, Tag for a compact removable label, and a future token-input pattern for text entry into a collection.",
  ],
  props: [
    ["tone", "neutral | accent", "Semantic appearance."],
    [
      "onRemove / removeLabel",
      "callback / string",
      "Named removal action; supply both or neither.",
    ],
  ],
} satisfies ComponentExample;
