import Preview from "./kbd.preview.js";
import code from "./kbd.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  props: [
    ["children", "ReactNode", "Key or key combination text."],
    [
      "Native props",
      "kbd attributes",
      "title, className, ref and style pass through.",
    ],
  ],
  notes: [
    "Kbd is a semantic hint, not a button and not a shortcut listener.",
    "Only advertise shortcuts implemented by the surrounding application.",
    "Keep platform-specific combinations in application content rather than reading navigator during render.",
  ],
} satisfies ComponentExample;
