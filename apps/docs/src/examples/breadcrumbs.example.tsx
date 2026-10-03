import Preview from "./breadcrumbs.preview.js";
import code from "./breadcrumbs.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "Root / List / Item",
      "nav / ol / li",
      "A named navigation landmark and an ordered trail; Item accepts an optional decorative separator.",
    ],
    [
      "List.maxItems",
      "number",
      "Opt-in long-trail disclosure. Trails at or below the limit render unchanged.",
    ],
    [
      "List.itemsBeforeCollapse / itemsAfterCollapse",
      "number",
      "Positive counts kept visible around the collapsed middle segment.",
    ],
    [
      "List.defaultExpanded / expandLabel / collapseLabel",
      "boolean / string / string",
      "Initial disclosure state and localizable toggle labels.",
    ],
    ["Link.href", "string", "A real link with native navigation behavior."],
    ["Current", "span", 'Marks the current location with aria-current="page".'],
  ],
  notes: [
    "Collapsing is opt-in. The disclosure control remains mounted while open so keyboard focus is preserved when the middle trail appears or disappears.",
    "Collapsed items are removed from the accessibility tree rather than visually hidden, so screen readers encounter the same bounded trail plus the disclosure control.",
    "Item separators default to /, may be replaced with product-appropriate content, and stay aria-hidden. The last one is visually suppressed.",
    "Links retain native keyboard behavior; no arrow-key engine is needed.",
    "Use a distinct Root label when a page includes more than one breadcrumb trail.",
  ],
} satisfies ComponentExample;
