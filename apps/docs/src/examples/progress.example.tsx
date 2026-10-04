import Preview, { IndeterminateProgress } from "./progress.preview.js";
import code from "./progress.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  previewTitle: "Determinate progress",
  previewDescription: "A finite value communicates measurable task completion.",
  variations: [
    {
      title: "Indeterminate progress",
      description:
        "Omit value when the operation is active but completion cannot yet be measured.",
      Preview: IndeterminateProgress,
    },
  ],
  code,
  notes: [
    "A progressbar requires an accessible name. Text placed inside a native progress element is not a substitute for labeling it.",
    "Omit value for indeterminate progress. Determinate values must be finite; max must be finite and greater than zero. Native progress clamps finite values outside the range.",
    "Use meter instead for budget usage or other measurements that are not task completion.",
  ],
  props: [
    [
      "value",
      "number | undefined",
      "Current progress. Omitted means indeterminate.",
    ],
    ["max", "number; default 100", "Finite positive task maximum."],
    ["aria-label / aria-labelledby", "string", "Supply an accessible name."],
  ],
} satisfies ComponentExample;
