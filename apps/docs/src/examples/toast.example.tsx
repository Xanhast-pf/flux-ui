import Preview from "./toast.preview.js";
import code from "./toast.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Use one Viewport per Provider. Providers isolate their queues and scoped themes; no global singleton is created.",
    "Timers start when an item is visible and pause on pointer hover, focus or document hiding. Set duration to zero for persistent notices.",
    "Use danger only for urgent errors. An optional action is outside the live text; do not rely on an expiring notice for the only copy of critical information.",
  ],
  props: [
    [
      "Provider: duration",
      "number",
      "Milliseconds; zero stays until dismissed.",
    ],
    ["Provider: maxVisible", "number", "Visible queue limit, default 3."],
    [
      "useToast: notify",
      "ToastOptions → string",
      "Enqueue a scoped notice and receive its ID.",
    ],
    [
      "Viewport: placement",
      "fixed | inline",
      "Use inline within a contained application scene.",
    ],
  ],
} satisfies ComponentExample;
