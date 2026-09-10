import Preview from "./pagination.preview.js";
import code from "./pagination.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  props: [
    [
      "Root.page / pageCount / onPageChange",
      "number / number / (page) => void",
      "Controlled one-based paging; values must be valid positive integers.",
    ],
    [
      "Previous / Next",
      "button props",
      "Boundaries disable automatically. Children override labels for localization.",
    ],
    [
      "Page.page",
      "number",
      "A button with current-page semantics. Override aria-label to localize Page N.",
    ],
    [
      "Ellipsis",
      "span",
      "Decorative omission marker for caller-selected ranges.",
    ],
  ],
  notes: [
    "This v1 controls local results with buttons; it is not a router or a fetch engine. Use real links for document navigation.",
    "The caller renders the desired page range, so 10,000 results do not create 10,000 buttons.",
    "Use a nearby polite status for result changes and keep keyboard focus on the activated control.",
    "Current-page clicks do not fire another change; disabled and canceled clicks do not change pages.",
  ],
} satisfies ComponentExample;
