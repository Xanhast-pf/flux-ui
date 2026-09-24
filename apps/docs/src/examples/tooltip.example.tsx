import Preview from "./tooltip.preview.js";
import code from "./tooltip.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "The child must forward native props and its ref. Supply its own visible label or accessible name; the tooltip is supplemental.",
    "Focus opens immediately, pointer hover respects delay, and the tooltip remains hoverable. Escape dismisses without moving focus.",
    "Use open/defaultOpen/onOpenChange only when application state must coordinate visibility; trigger-owned state remains the default.",
    "Content must be non-interactive. For interactive content use Popover. Disabled controls should have a visible explanation instead.",
  ],
  props: [
    ["children", "ReactElement", "One ref-forwarding control."],
    ["content", "ReactNode", "Non-interactive supplementary help."],
    ["delay", "number", "Pointer opening delay in milliseconds, default 300."],
    [
      "open / defaultOpen / onOpenChange",
      "boolean / callback",
      "Optional controlled or initially-open visibility state.",
    ],
  ],
} satisfies ComponentExample;
