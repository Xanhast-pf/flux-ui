import Preview from "./fader.preview.js";
import code from "./fader.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Deprecated compatibility export. New code should use Slider orientation=vertical; existing Fader imports and native props continue to work.",
    "Slider now owns orientation, custom appearance and resetValue. See the Slider page for the primary API.",
    "Vertical single native range input, not a multi-thumb widget.",
    "Native keyboard, form and disabled semantics are preserved; use aria-valuetext to expose units.",
  ],
  props: [
    [
      "Native range props",
      "value, min, max, step, disabled",
      "Same data and event API as Slider.",
    ],
  ],
} satisfies ComponentExample;
