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
      "First / Previous / Next / Last",
      "button props",
      "Boundary controls disable automatically. Children override visible labels for localization.",
    ],
    [
      "Range.siblingCount / boundaryCount",
      "number",
      "Generates a bounded current-page window plus start/end boundaries and decorative omission markers.",
    ],
    [
      "Range.getPageLabel",
      "(page) => string",
      "Localizes accessible labels for generated page buttons.",
    ],
    [
      "Page.page",
      "number",
      "A button with current-page semantics. Override aria-label to localize Page N.",
    ],
    [
      "Ellipsis",
      "span",
      "Decorative omission marker for caller-selected or generated ranges.",
    ],
  ],
  notes: [
    "Pagination controls local results with buttons; it is not a router or fetch engine. Use real links for document navigation.",
    "Range keeps very large result sets bounded instead of creating one button per page.",
    "Use explicit Page/Ellipsis composition when an application needs a completely custom range or rendering policy.",
    "Use a nearby polite status for result changes and keep keyboard focus on the activated control.",
    "Current-page clicks do not fire another change; disabled and canceled clicks do not change pages.",
  ],
} satisfies ComponentExample;
