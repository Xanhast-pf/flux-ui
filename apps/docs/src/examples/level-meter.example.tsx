import Preview from "./level-meter.preview.js";
import code from "./level-meter.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "A passive labelled meter, not a slider. Flux owns role and numeric ARIA meter state; callers may customize aria-valuetext for units. The application owns updates, peak hold and clip reset.",
    "The visible CLIP indication does not rely solely on color. Do not make frame-rate changes live announcements.",
  ],
  props: [
    [
      "value / peak",
      "number",
      "Application-provided current and optional peak readings.",
    ],
    ["clipped", "boolean", "Caller-owned clip indication."],
    [
      "orientation",
      "vertical | horizontal",
      "Visual axis only; read-only meter semantics.",
    ],
  ],
} satisfies ComponentExample;
