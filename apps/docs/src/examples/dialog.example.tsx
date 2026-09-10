import Preview from "./dialog.preview.js";
import code from "./dialog.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Native top-layer modal behavior with automatic title and description wiring.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    [
      "Root",
      "open / defaultOpen / onOpenChange",
      "Controlled or uncontrolled modal state.",
    ],
    [
      "Trigger / Close",
      "button props",
      "Open and close with native button semantics.",
    ],
    [
      "Popup",
      "dialog props; closeOnBackdrop",
      "Native modal top-layer content.",
    ],
    [
      "Title / Description",
      "Compound parts",
      "Accessible title and optional description.",
    ],
  ],
} satisfies ComponentExample;
