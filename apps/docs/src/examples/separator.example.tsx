import Preview from "./separator.preview.js";
import code from "./separator.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "The default horizontal hr is a semantic separator.",
    'Use decorative when the line only supports visual layout; it then uses role="none" and has no aria-orientation.',
    "Vertical separators stretch inside flex layouts; use normal CSS when a fixed height is needed.",
  ],
  props: [
    ["orientation", "horizontal | vertical", "Direction; default horizontal."],
    [
      "decorative",
      "boolean; default false",
      "Remove separator semantics when purely presentational.",
    ],
  ],
} satisfies ComponentExample;
