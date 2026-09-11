import type { ComponentExample } from "../lib/examples.js";
import Preview from "./stat.preview.js";
import code from "./stat.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Stat composes a native dl/dt/dd relationship, with shared Text and Stack primitives.",
    "A zero is a real value and is displayed. Use an explicit pending note for missing data instead of inventing a measurement.",
  ],
  props: [
    ["label / value", "ReactNode", "Required semantic name and value."],
    ["note", "ReactNode", "Optional supporting context or caveat."],
    ["Native dl props", "HTMLDListElement", "Native ref and attributes."],
  ],
} satisfies ComponentExample;
