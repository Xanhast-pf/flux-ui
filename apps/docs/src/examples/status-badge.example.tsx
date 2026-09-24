import Preview from "./status-badge.preview.js";
import code from "./status-badge.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "StatusBadge is a standalone non-interactive status label, not a count/dot overlay attached to another control.",
    "Use real buttons and links for actions; compose overlay indicators separately rather than making StatusBadge interactive.",
    "Meaningful text carries the status; color is supplementary.",
  ],
  props: [
    [
      "tone",
      "neutral | accent | success | warning | danger | info",
      "Presentation only; default neutral.",
    ],
    [
      "Native props",
      "span attributes",
      "Children, refs, className, style and data attributes are preserved.",
    ],
  ],
} satisfies ComponentExample;
