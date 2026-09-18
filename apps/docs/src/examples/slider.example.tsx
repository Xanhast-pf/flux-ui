import Preview from "./slider.preview.js";
import code from "./slider.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "One native range owns pointer, keyboard, validation and form behavior. Vertical sliders put the minimum at the bottom; no rotation or drag engine is needed.",
    "Double-click resets an uncontrolled slider to its mount-time default (the native midpoint when omitted). Controlled sliders reset only when resetValue is supplied. The parent remains authoritative.",
    "The browser clamps and steps reset values. onDoubleClick and onChange can cancel their downstream work; disabled/readOnly controls do not reset. No synthetic ChangeEvent is fabricated.",
    "Double-click is a convenience, not the only reset action: provide a labelled Reset button. Home and End still reach the range limits.",
    "Use appearance=custom with --flux-slider-length, --flux-slider-track-size, --flux-slider-thumb-size, --flux-slider-thumb-inline-size, --flux-slider-thumb-block-size and --flux-slider-thumb-radius. The default native appearance keeps browser styling.",
    "Use orientation=vertical for fader-style controls. Slider remains single-thumb, not logarithmic or multi-thumb.",
  ],
  props: [
    [
      "orientation",
      "horizontal | vertical",
      "Direction and native range geometry.",
    ],
    [
      "appearance",
      "native | custom",
      "Native rendering or a statically themed, customizable skin.",
    ],
    [
      "resetValue",
      "number",
      "Explicit double-click target; required for controlled reset.",
    ],
    [
      "min / max / step",
      "Native attributes",
      "Browser clamping and stepping, including reset.",
    ],
    [
      "value / defaultValue",
      "Native input value",
      "Controlled or initial value.",
    ],
    [
      "onValueChange",
      "(number, ChangeEvent) => void",
      "Numeric callback after the native onChange path.",
    ],
  ],
} satisfies ComponentExample;
