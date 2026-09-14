import Preview from "./dropdown-menu.preview.js";
import code from "./dropdown-menu.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Arrow keys, Home, End and typeahead navigate enabled items. Enter or Space activates. Tab leaves the menu rather than trapping focus.",
    "onSelect runs an action. Prevent default in onClick to keep the menu open. Disabled items are skipped.",
    "This first release is a flat action menu. It does not claim submenu, checkbox-menu, radio-menu or context-menu support.",
  ],
  props: [
    ["Item: onSelect", "() => void", "Run an action and close the menu."],
    [
      "Item: disabled",
      "boolean",
      "Make the item unavailable to keyboard and pointer activation.",
    ],
    ["Popup", "named menu", "Compose flat items, labels and separators."],
  ],
} satisfies ComponentExample;
