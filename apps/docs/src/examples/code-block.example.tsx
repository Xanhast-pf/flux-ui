import type { ComponentExample } from "../lib/examples.js";
import Preview from "./code-block.preview.js";
import code from "./code-block.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Literal code remains selectable even when clipboard permission is unavailable. No HTML or code is executed.",
    "Copy feedback is associated with the exact code string, so a late result cannot claim success for new content.",
    "Disable copyable for read-only code displays; no copy action is rendered.",
  ],
  props: [
    ["code", "string", "Required literal source text."],
    ["label", "string", "Visible heading and scroll-region accessible name."],
    [
      "copyable",
      "boolean",
      "Show the optional clipboard action; defaults true.",
    ],
  ],
} satisfies ComponentExample;
