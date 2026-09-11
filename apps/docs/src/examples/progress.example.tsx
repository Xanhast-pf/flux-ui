import Preview from "./progress.preview.js";
import code from "./progress.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "A progressbar requires an accessible name. Text placed inside a native progress element is not a substitute for labeling it.",
    "Omit value for indeterminate progress. Zero is a determinate value, not a loading sentinel.",
    "Use meter instead for budget usage or other measurements that are not task completion.",
  ],
  props: [
    [
      "value",
      "number | undefined",
      "Current progress. Omitted means indeterminate.",
    ],
    ["max", "number; default 100", "Positive task maximum."],
    ["aria-label / aria-labelledby", "string", "Supply an accessible name."],
  ],
} satisfies ComponentExample;
