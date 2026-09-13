import Preview from "./sidebar.preview.js";
import code from "./sidebar.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Keep Root above route content. Route transitions do not close or remount the panel.",
    "Use ordinary links in a named navigation landmark, not ARIA menu items. Toggle exposes expanded state.",
    "Below 48rem of available layout width the panel stacks above the content. There is no backdrop, focus trap, scroll lock or automatic Escape close.",
    "Closing from inside the panel returns focus to an outside toggle. User refs and native props are preserved.",
  ],
  props: [
    [
      "Root open / defaultOpen / onOpenChange",
      "boolean / callback",
      "Controlled or uncontrolled state; storage belongs to the app.",
    ],
    [
      "Layout",
      "div props",
      "Owns the two-column layout. --flux-sidebar-width and --flux-sidebar-offset are optional CSS integration hooks.",
    ],
    [
      "Panel",
      "named aside",
      "Hidden but mounted while closed; preserves local state and scroll.",
    ],
    [
      "Toggle / Close",
      "Button props",
      "Explicitly toggle or close without changing routes.",
    ],
    ["Content", "div props", "Adjacent, always interactive content."],
  ],
} satisfies ComponentExample;
