import type { ComponentExample } from "../lib/examples.js";
import Preview from "./skip-link.preview.js";
import code from "./skip-link.preview.tsx?raw";
export default {
  Preview,
  code,
  notes: [
    "The link is revealed on focus and is never wrapped in VisuallyHidden. Provide a real, focusable target.",
    "Native fragment navigation is the default. Hash-router applications can preserve their route and focus the target from an explicit click handler.",
  ],
  props: [
    ["href", "string", "Required destination fragment."],
    ["children", "ReactNode", "Defaults to Skip to content."],
    [
      "Native anchor props",
      "HTMLAnchorElement",
      "Native ref, click handling and attributes.",
    ],
  ],
} satisfies ComponentExample;
