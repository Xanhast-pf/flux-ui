import type { ComponentExample } from "../lib/examples.js";
import Preview from "./link.preview.js";
import code from "./link.preview.tsx?raw";
export default {
  Preview,
  code,
  notes: [
    "Every treatment renders an anchor: href, download, context-menu and browser navigation remain native.",
    "For an unavailable destination, omit href and describe the state. aria-disabled alone does not stop navigation.",
    "Use Button for actions, not a styled anchor without a destination.",
  ],
  props: [
    [
      "variant",
      "text | navigation | solid | soft | outline | ghost",
      "Anchor appearance, sharing the button action recipe.",
    ],
    ["tone / size", "Action variants", "Shared colors and control sizing."],
    [
      "href / download / ref",
      "Native anchor props",
      "Native navigation; no router or simulated click navigation is added.",
    ],
  ],
} satisfies ComponentExample;
