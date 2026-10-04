import Preview, { SpinnerSizes } from "./spinner.preview.js";
import code from "./spinner.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  previewTitle: "Named loading status",
  previewDescription:
    "A meaningful label lets one spinner announce the loading operation.",
  variations: [
    {
      title: "Decorative size scale",
      description:
        "When a parent already owns the status, decorative spinners can vary only in size.",
      Preview: SpinnerSizes,
    },
  ],
  code,
  props: [
    [
      "label",
      "string | null",
      "A screen-reader status, default Loading. null makes the spinner decorative.",
    ],
    ["size", "sm | md | lg", "1rem, 1.5rem or 2rem indicator."],
  ],
  notes: [
    "Use one live status per loading operation. Supply a meaningful operation name or null when a parent already announces it.",
    "Reduced motion stops rotation; the visible ring and accessible status remain.",
    "A spinner does not simulate progress or trigger network work.",
  ],
} satisfies ComponentExample;
