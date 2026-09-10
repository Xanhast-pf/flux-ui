import Preview from "./badge.preview.js";
import code from "./badge.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Badge is a non-interactive span. Use real buttons and links for actions.",
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
