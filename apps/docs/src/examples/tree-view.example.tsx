import Preview from "./tree-view.preview.js";
import code from "./tree-view.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "TreeView's expandedItems/defaultExpandedItems is the set of expanded item identifiers. Every TreeView.Item requires a stable unique value.",
    "Arrow Up/Down moves through visible items; Home/End jump to the first/last visible item. Arrow Right opens a branch or enters its first child; Arrow Left closes an open branch or returns to its parent. Enter toggles the focused branch.",
    "Clicking a branch label focuses and toggles it. Leaf items remain focusable treeitems but the initial alpha does not freeze selection, activation, editing, drag/drop, async loading, or virtualization APIs.",
    "aria-disabled items are skipped by roving focus and cannot be toggled by pointer input.",
    "Nested TreeView.Item children become role=group automatically; do not add interactive controls inside the label content.",
  ],
  props: [
    [
      "Root expandedItems / defaultExpandedItems",
      "readonly string[]",
      "Controlled or uncontrolled expanded item values.",
    ],
    [
      "Root onExpandedItemsChange",
      "(expandedItems: readonly string[]) => void",
      "Reports the next expanded-item set.",
    ],
    [
      "Item value",
      "string",
      "Required stable identity; values must be unique within a tree.",
    ],
    ["Item label", "ReactNode", "Visible label and accessible name."],
    [
      "Item children",
      "TreeView.Item nodes",
      "Nested items; presence makes the item expandable.",
    ],
    [
      "Native props",
      "ul / li attributes",
      "Refs, className, style, data attributes, events, and aria-disabled compose normally.",
    ],
  ],
} satisfies ComponentExample;
