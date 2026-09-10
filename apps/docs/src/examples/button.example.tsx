import Preview from "./button.preview.js";
import code from "./button.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Native button semantics with Flux variants, tones, sizes, and states.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    [
      "variant",
      "solid | soft | outline | ghost",
      "Visual treatment; default solid.",
    ],
    [
      "tone / size",
      "accent | neutral | danger; sm | md | lg",
      "Semantic tone and control size.",
    ],
    [
      "loading / disabled",
      "boolean",
      "Loading also disables activation. Native type defaults to button.",
    ],
    [
      "startIcon / endIcon",
      "ReactNode",
      "Optional decorative or labeled content.",
    ],
  ],
} satisfies ComponentExample;
