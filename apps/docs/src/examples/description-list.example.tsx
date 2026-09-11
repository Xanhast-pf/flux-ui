import type { ComponentExample } from "../lib/examples.js";
import Preview from "./description-list.preview.js";
import code from "./description-list.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Term and Details render dt and dd directly inside the native dl. No listbox or table roles are invented.",
    "Use one or more terms followed by their descriptions. Values can contain normal links or other content.",
  ],
  props: [
    ["DescriptionList", "Native dl props", "Semantic description group."],
    [
      "Term / Details",
      "Native dt / dd props",
      "Term and description elements with matching native refs.",
    ],
  ],
} satisfies ComponentExample;
