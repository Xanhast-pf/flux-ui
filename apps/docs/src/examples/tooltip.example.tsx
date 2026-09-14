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
    "Content must be non-interactive. For interactive content use Popover. Disabled controls should have a visible explanation instead.",
  ],
  props: [
    ["children", "ReactElement", "One ref-forwarding control."],
    ["content", "ReactNode", "Non-interactive supplementary help."],
    ["delay", "number", "Pointer opening delay in milliseconds, default 300."],
  ],
} satisfies ComponentExample;
