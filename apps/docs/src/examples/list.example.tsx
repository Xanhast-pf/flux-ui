import type { ComponentExample } from "../lib/examples.js";
import Preview from "./list.preview.js";
import code from "./list.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "List renders ul or ol, with native li items. It is content, not an ARIA menu or listbox.",
    "Plain lists keep explicit list semantics for browsers that suppress them after list-style: none.",
  ],
  props: [
    [
      "as",
      "ul | ol",
      "Native ordered or unordered list; ol accepts start/reversed.",
    ],
    [
      "variant / gap",
      "marker | plain; LayoutGap",
      "Static marker treatment and shared spacing tokens.",
    ],
    ["List.Item", "Native li props", "Item contents, value and native ref."],
  ],
} satisfies ComponentExample;
