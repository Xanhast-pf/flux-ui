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
    "Optional lexical coloring supports 19 language names and common aliases. Unknown languages stay plain; this is not a compiler or semantic highlighter.",
    "For static pages, pass build-time tokens. A highlighter adapter can load richer grammars lazily; stale async results are discarded.",
    "Disable copyable for read-only code displays; no copy action is rendered.",
  ],
  props: [
    [
      "tokens / highlight",
      "CodeToken[] / CodeHighlighter",
      "Precomputed UTF-16 ranges or an abort-aware async grammar provider. Source always stays literal.",
    ],
    [
      "language",
      "string",
      "Language label passed to the optional provider; plain text is the default.",
    ],
    ["code", "string", "Required literal source text."],
    ["label", "string", "Visible heading and scroll-region accessible name."],
    [
      "copyable",
      "boolean",
      "Show the optional clipboard action; defaults true.",
    ],
  ],
} satisfies ComponentExample;
