import type { ComponentExample } from "../lib/examples.js";
import Preview from "./empty-state.preview.js";
import code from "./empty-state.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "EmptyState is ordinary content, not an automatic alert. Announce changing result counts separately when needed.",
    "Choose a headingLevel appropriate to the surrounding page. Children can provide real actions without adding new action props.",
  ],
  props: [
    [
      "title / description",
      "ReactNode",
      "Heading and optional supporting content.",
    ],
    [
      "headingLevel",
      "2 | 3 | 4",
      "Explicit integration into the surrounding outline.",
    ],
    ["children", "ReactNode", "Optional actions or additional content."],
  ],
} satisfies ComponentExample;
