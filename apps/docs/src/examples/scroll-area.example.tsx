import type { ComponentExample } from "../lib/examples.js";
import Preview from "./scroll-area.preview.js";
import code from "./scroll-area.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Supply aria-label or aria-labelledby. This is a named native scroll region, not custom scrollbars.",
    "Overflowing regions enter the tab order automatically; fitting regions do not add an extra tab stop. Explicit tabIndex is preserved.",
    "Observation is local to mounted ScrollArea instances and is cleaned up on unmount. Layout primitives do not install observers.",
  ],
  props: [
    [
      "aria-label / aria-labelledby",
      "AccessibleName",
      "At least one name is required.",
    ],
    [
      "axis",
      "both | horizontal | vertical",
      "Which native overflow axes are enabled.",
    ],
    [
      "tabIndex / ref / style",
      "Native div props",
      "Explicit focus policy, native ref and caller-owned geometry.",
    ],
  ],
} satisfies ComponentExample;
