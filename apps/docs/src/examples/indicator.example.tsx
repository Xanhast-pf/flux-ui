import Preview from "./indicator.preview.js";
import code from "./indicator.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "content",
      "string | number",
      "Visible decorative content. Omit it for a dot indicator.",
    ],
    ["max", "number", 'Caps numeric counts as "max+". Defaults to 99.'],
    [
      "tone / placement",
      "StatusBadgeTone / four corners",
      "Controls overlay color and logical-corner placement.",
    ],
  ],
  notes: [
    "The overlay is always aria-hidden. Meaningful count/state belongs in the owning control's accessible name.",
    "Indicator does not announce updates or add live-region semantics.",
    "Use StatusBadge for inline status text; Indicator is specifically an overlay capability.",
  ],
} satisfies ComponentExample;
