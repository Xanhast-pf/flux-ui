import Preview from "./alert-dialog.preview.js";
import code from "./alert-dialog.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Put the least destructive action first. Escape cancels; backdrop interaction does not dismiss.",
    "Title and Description use the same native-modal labeling as Dialog. Cancel and Action both close after their click handler unless it prevents the default.",
    "This component performs no deletion, server call or asynchronous task itself.",
  ],
  props: [
    [
      "Root: open / onOpenChange",
      "boolean / callback",
      "Own confirmation state in the application.",
    ],
    ["Popup", "native dialog", "Backdrop dismissal is disabled."],
    [
      "Cancel",
      "button props",
      "Cancel without running the consequential action.",
    ],
    [
      "Action",
      "button props",
      "Run the consequential action and close by default.",
    ],
  ],
} satisfies ComponentExample;
