import type { ComponentExample } from "../lib/examples.js";
import Preview from "./box.preview.js";
import code from "./box.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Box renders one selected native element. It does not add button semantics to a card or section.",
    "Padding uses the shared finite token scale. Nested boxes reset instance spacing rather than inheriting it.",
  ],
  props: [
    [
      "as",
      "LayoutElement",
      "Constrained native semantics, with matching props and ref.",
    ],
    [
      "padding / paddingBlock / paddingInline",
      "LayoutGap",
      "Named gaps or numbered token steps; not arbitrary CSS.",
    ],
    [
      "surface / border / radius",
      "Finite variants",
      "Shared static surface treatment; className and style remain escape hatches.",
    ],
  ],
} satisfies ComponentExample;
