import type { ComponentExample } from "../lib/examples.js";
import Preview from "./color-swatch.preview.js";
import code from "./color-swatch.preview.tsx?raw";
export default {
  Preview,
  code,
  notes: [
    "The swatch is always decorative and owns aria-hidden; role, focus and accessible naming belong to the enclosing Toggle or ToggleGroup.Item.",
    "A check mark supplements color for a selected sample; do not use color as the only accessible status signal.",
  ],
  props: [
    ["color", "string", "A CSS color or semantic token reference."],
    [
      "selected",
      "boolean",
      "Optional visible check mark, not an independent control state.",
    ],
    ["size", "sm | md | lg", "Finite sample sizes."],
  ],
} satisfies ComponentExample;
