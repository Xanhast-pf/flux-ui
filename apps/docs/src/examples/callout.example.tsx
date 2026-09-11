import Preview from "./callout.preview.js";
import code from "./callout.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "The default role is note. Static callouts do not interrupt assistive technology.",
    'Use role="status" for polite updates and role="alert" only for genuinely urgent feedback. Keep live regions mounted before updating their contents.',
  ],
  props: [
    [
      "tone",
      "neutral | accent | success | warning | danger | info",
      "Visual emphasis; default info.",
    ],
    [
      "role",
      "Native div role; default note",
      "Choose announcement semantics intentionally.",
    ],
    ["children", "ReactNode", "Compose the message, heading and actions."],
  ],
} satisfies ComponentExample;
