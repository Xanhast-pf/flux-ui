import type { ComponentExample } from "../lib/examples.js";
import Preview, { LinkActionTreatments } from "./link.preview.js";
import code from "./link.preview.tsx?raw";
export default {
  Preview,
  previewTitle: "Text and navigation",
  previewDescription:
    "Lightweight link treatments stay visually distinct from action-like links.",
  variations: [
    {
      title: "Action treatments",
      description:
        "Action-style variants still render native anchors and keep navigation behavior.",
      Preview: LinkActionTreatments,
    },
  ],
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
    [
      "tone / size",
      "Action-style variants only",
      "Available with solid, soft, outline or ghost; text and navigation links reject these no-op combinations.",
    ],
    [
      "href / download / ref",
      "Native anchor props",
      "Native navigation; no router or simulated click navigation is added.",
    ],
  ],
} satisfies ComponentExample;
