import type { ComponentExample } from "../lib/examples.js";
import Preview from "./fieldset.preview.js";
import code from "./fieldset.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "The browser owns disabled-fieldset behavior, including the first-legend exception. No context emulation is added.",
    "Use Field for individual control names/descriptions and Fieldset.Legend for the group name.",
  ],
  props: [
    [
      "disabled / name / form",
      "Native fieldset props",
      "Native grouped-control behavior and form ownership.",
    ],
    [
      "Fieldset.Legend",
      "Native legend props",
      "The accessible name of the group.",
    ],
  ],
} satisfies ComponentExample;
