import type { ComponentExample } from "../lib/examples.js";
import Preview from "./code.preview.js";
import code from "./code.preview.tsx?raw";
export default {
  Preview,
  code,
  notes: [
    "Code is a native code element and renders React text literally. It is not a syntax-highlighting engine.",
    "Use CodeBlock for multiline code with optional copying and a named overflow region.",
  ],
  props: [
    [
      "children",
      "ReactNode",
      "Literal code text; no HTML injection or evaluation.",
    ],
    [
      "Native code props",
      "HTMLElement",
      "Class, style, ref and native attributes.",
    ],
  ],
} satisfies ComponentExample;
