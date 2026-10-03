import Preview from "./bottom-navigation.preview.js";
import code from "./bottom-navigation.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "Accessible name",
      "aria-label | aria-labelledby",
      "Names the navigation landmark. BottomNavigation does not assume whether it is the application's primary or secondary navigation.",
    ],
    [
      "Item.href",
      "string",
      "Uses a real anchor destination so routing, history, open-in-new-tab and platform link behavior stay application/browser owned.",
    ],
    [
      "Item.current",
      "boolean",
      'Marks the active destination with aria-current="page" and a distinct non-color-only visual state.',
    ],
    [
      "Item.icon",
      "ReactNode",
      "Optional decorative icon. The item label remains the accessible destination name.",
    ],
  ],
  notes: [
    "BottomNavigation is a navigation surface, not an application-shell positioning primitive. Sticky or fixed placement belongs to the consuming layout.",
    "Items remain ordinary links in normal Tab order; there is no roving-focus or controlled-index state machine.",
    "Use current on the destination represented by the current route. The component intentionally does not infer routes or own router state.",
    "Keep a meaningful destination label even when an icon is present. Icons are hidden from the accessibility tree so they do not duplicate that label.",
  ],
} satisfies ComponentExample;
