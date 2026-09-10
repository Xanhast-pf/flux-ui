import Preview from "./toolbar.preview.js";
import code from "./toolbar.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  props: [
    [
      "Root accessible name",
      "aria-label | aria-labelledby",
      "Required group name. Use a toolbar for three or more related controls.",
    ],
    [
      "orientation / loopFocus",
      "horizontal | vertical; boolean",
      "Arrow-key axis and optional wraparound.",
    ],
    [
      "Button / Link",
      "native button / anchor props",
      "Participating controls share one roving tab stop; refs preserve React 19 cleanup.",
    ],
    [
      "Separator",
      "native hr props",
      "Decorative divider follows toolbar orientation.",
    ],
  ],
  notes: [
    "Arrows move focus; Home/End jump to edges. Enter and Space retain each native control's behavior.",
    "Use Toolbar.Button and Toolbar.Link for the shared focus collection. Do not insert textboxes or nested roving widgets into this v1 toolbar.",
    "Disabled and hidden items are skipped. Consumer onKeyDown can preventDefault to keep a key.",
    "Focus is repaired after removal or disabling; no MutationObserver or global key listener is installed.",
  ],
} satisfies ComponentExample;
