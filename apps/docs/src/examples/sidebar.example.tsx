import Preview from "./sidebar.preview.js";
import code from "./sidebar.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  previewWidth: "wide",
  notes: [
    "The wide canvas demonstrates desktop push layout; Compact preview demonstrates a mobile Drawer. The mode is labelled explicitly and follows available canvas width, not a simulated device.",
    "Keep desktop Sidebar state and temporary mobile Drawer state separate. Closing mobile navigation after a destination is selected must not clear the desktop open preference.",
    "The docs shell uses the public Drawer below 48rem so opening navigation while scrolled down keeps it in the viewport. Sidebar itself stays non-modal.",
    "Keep the desktop Root above route content. Route transitions do not close or remount its panel.",
    "Use ordinary links in a named navigation landmark, not ARIA menu items. Toggle exposes expanded state.",
    "A bare Sidebar still stacks below 48rem with no modality. For application navigation, choose Drawer at that breakpoint as this preview does; the mobile Drawer supports Escape, focus containment and scroll locking.",
    "Closing from inside the panel returns focus to an outside toggle. User refs and native props are preserved.",
  ],
  props: [
    [
      "Root open / defaultOpen / onOpenChange",
      "boolean / callback",
      "Controlled open requires onOpenChange; uncontrolled state may use defaultOpen. Storage belongs to the app.",
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
