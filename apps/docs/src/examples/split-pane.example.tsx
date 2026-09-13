import Preview from "./split-pane.preview.js";
import code from "./split-pane.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "An in-flow two-pane layout, separate from Sidebar and Drawer.",
    "The focusable separator supports dragging and arrow/Home/End keys, including horizontal RTL.",
    "Values and limits are percentages; provide a bounded block size when using a vertical split.",
  ],
  props: [
    ["first / second", "ReactNode", "Composable pane contents."],
    ["value / defaultValue", "number", "First pane percentage."],
    ["min / max", "number", "Accessible resizing limits."],
  ],
} satisfies ComponentExample;
