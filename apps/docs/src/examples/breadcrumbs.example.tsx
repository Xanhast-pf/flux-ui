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
    ["Link.href", "string", "A real link with native navigation behavior."],
    ["Current", "span", 'Marks the current location with aria-current="page".'],
  ],
  notes: [
    "Item separators default to /, may be replaced with product-appropriate content, and stay aria-hidden. The last one is visually suppressed.",
    "Links retain native keyboard behavior; no arrow-key engine is needed.",
    "Use a distinct Root label when a page includes more than one breadcrumb trail.",
  ],
} satisfies ComponentExample;
