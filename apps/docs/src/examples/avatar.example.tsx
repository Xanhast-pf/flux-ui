import Preview from "./avatar.preview.js";
import code from "./avatar.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  props: [
    [
      "alt",
      "string",
      "Required accessible identity; use an empty string when adjacent text names it.",
    ],
    [
      "src / fallback",
      "string / ReactNode",
      "Fallback stays available while loading or after errors. Change src to retry.",
    ],
    [
      "size",
      "sm | md | lg",
      "Token-aligned identity sizes. The native ref and styling target the root span.",
    ],
  ],
  notes: [
    "The root supplies a single accessible image name; the internal image and fallback are decorative to avoid duplicate announcements.",
    "Use text or a decorative icon for fallback, not an interactive control.",
    "Changing src resets a previous failure without an effect. An old image error cannot hide a different source.",
    "Images are optional. No initials inference, external avatar service, or network dependency is introduced.",
  ],
} satisfies ComponentExample;
