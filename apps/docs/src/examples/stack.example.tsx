import Preview from "./stack.preview.js";
import code from "./stack.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Vertical composition with token-driven responsive gaps.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    ["gap", "Responsive token gap", "Vertical spacing between children."],
    ["align", "start | center | end | stretch", "Cross-axis alignment."],
  ],
} satisfies ComponentExample;
