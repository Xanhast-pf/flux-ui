import Preview from "./slider.preview.js";
import code from "./slider.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "One native range owns pointer, keyboard, validation and form behavior. Vertical sliders put the minimum at the bottom; no rotation or drag engine is needed.",
    "marks uses the platform range+datalist relationship. Flux does not replace the thumb or keyboard model to draw tick marks.",
    "showValue adds a visual output that mirrors the native range value. formatValue controls presentation; the range itself remains the accessible value owner.",
    "Double-click resets an uncontrolled slider to its mount-time default (the native midpoint when omitted). Controlled sliders reset only when resetValue is supplied. The parent remains authoritative.",
    "The browser clamps and steps reset values. onDoubleClick and onChange can cancel their downstream work; disabled controls do not reset. Native range inputs do not have a read-only interaction mode. No synthetic ChangeEvent is fabricated.",
    "Double-click is a convenience, not the only reset action: provide a labelled Reset button. Home and End still reach the range limits.",
    "Use appearance=custom with --flux-slider-length, --flux-slider-track-size, --flux-slider-thumb-size, --flux-slider-thumb-inline-size, --flux-slider-thumb-block-size and --flux-slider-thumb-radius. The default native appearance keeps browser styling.",
    "Slider remains single-thumb. Range thumbs and a custom slider state machine are intentionally out of scope.",
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
      "marks",
      "readonly (number | { value, label? })[]",
      "Native datalist tick values. Cannot be combined with the native list prop.",
    ],
    [
      "showValue / formatValue",
      "boolean / (number) => string",
      "Optional visual output and its formatter.",
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
