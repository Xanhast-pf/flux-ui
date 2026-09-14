import Preview from "./popover.preview.js";
import code from "./popover.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Give Popup an accessible name. This is a non-modal dialog, not a modal Drawer.",
    "The native top layer preserves scoped theme ancestry. Escape and outside interaction dismiss; closing from inside returns focus without stealing outside focus.",
    "Use open/onOpenChange for controlled ownership, initialFocus for an explicit target, and side/align/offset for placement. Keep one Trigger and one Popup per Root.",
  ],
  props: [
    ["Root: open / defaultOpen", "boolean", "Controlled or local open state."],
    [
      "Popup: side / align",
      "placement",
      "Prefer a side; flip and clamp within the viewport.",
    ],
    [
      "Popup: initialFocus",
      "RefObject<HTMLElement | null>",
      "Optional initial focus destination.",
    ],
  ],
} satisfies ComponentExample;
