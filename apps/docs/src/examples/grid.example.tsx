import Preview from "./grid.preview.js";
import code from "./grid.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Native CSS Grid with responsive tracks and auto-fit sizing.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    [
      "columns / minColumnWidth / templateColumns",
      "Mutually exclusive modes",
      "Fixed count, auto-fit or explicit CSS grid tracks.",
    ],
    [
      "gap / rowGap / columnGap",
      "Responsive token gaps",
      "Quarter-rem layout rhythm.",
    ],
    [
      "Grid.Item",
      "Spans / alignment / subgrid",
      "Control individual grid children.",
    ],
  ],
} satisfies ComponentExample;
