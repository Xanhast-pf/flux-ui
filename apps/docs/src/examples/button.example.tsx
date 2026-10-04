import Preview, {
  ButtonSizes,
  ButtonStates,
  ButtonTones,
} from "./button.preview.js";
import code from "./button.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewTitle: "Variants",
  previewDescription:
    "Choose the treatment independently from semantic tone and control size.",
  variations: [
    {
      title: "Tones",
      description: "Accent, neutral, and danger communicate action intent.",
      Preview: ButtonTones,
    },
    {
      title: "Sizes",
      description:
        "The same action treatment scales through three control sizes.",
      Preview: ButtonSizes,
    },
    {
      title: "States",
      description:
        "Disabled and loading states preserve native button semantics.",
      Preview: ButtonStates,
    },
  ],
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
      "Loading also disables activation and owns aria-busy. Native type defaults to button.",
    ],
    [
      "startIcon / endIcon",
      "ReactNode",
      "Optional decorative or labeled content.",
    ],
  ],
} satisfies ComponentExample;
