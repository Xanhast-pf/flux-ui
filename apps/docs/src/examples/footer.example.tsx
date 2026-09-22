import Preview from "./footer.preview.js";
import code from "./footer.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Footer renders a native <footer> landmark and accepts native footer attributes.",
    "Its automatic block-start margin keeps it at the page end when a flex-column parent has spare height; it does not use fixed or sticky positioning.",
    "Footer adds a standard top divider and vertical padding while leaving content composition to the application.",
  ],
  props: [
    [
      "children",
      "ReactNode",
      "Footer content composed from normal Flux primitives.",
    ],
    [
      "Native footer props",
      "HTMLElement attributes",
      "Forwarded to the underlying <footer>, including className, style, refs, and aria-* attributes.",
    ],
  ],
} satisfies ComponentExample;
