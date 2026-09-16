import Preview from "./knob.preview.js";
import code from "./knob.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Choose sm, md or lg; override --flux-knob-size for a custom diameter. The ring and indicator scale with the dial.",
    "Double-click resets uncontrolled knobs to their mount-time default. Controlled knobs require resetValue. Reset is clamped and snapped, ends any active interaction and commits once only when the value changes.",
    "Keep a keyboard-accessible Reset action alongside double-click; Home/End remain range endpoints.",
    "A labelled single-value slider with linear or positive logarithmic mapping.",
    "Pointer capture supports vertical dragging; Shift refines movement. Arrow/Page/Home/End keys and change/commit callbacks are supported.",
    "Cancellation restores the initial value. No wheel interception, animation loop, audio permission or DSP is installed.",
    "Pair with NumberField for exact entry and form submission. Custom sliders need touch-assistive-technology testing.",
  ],
  props: [
    [
      "size",
      "sm | md | lg",
      "Coordinated dial size; md is the existing default.",
    ],
    [
      "resetValue",
      "number",
      "Explicit reset target; required for controlled reset.",
    ],
    [
      "value / defaultValue",
      "number",
      "Controlled/uncontrolled numeric value.",
    ],
    [
      "min / max / step",
      "number",
      "Finite increasing domain and positive step.",
    ],
    ["scale", "linear | log", "Log requires a positive minimum."],
    [
      "onValueCommit",
      "(number) => void",
      "Completed keyboard/pointer interactions.",
    ],
  ],
} satisfies ComponentExample;
