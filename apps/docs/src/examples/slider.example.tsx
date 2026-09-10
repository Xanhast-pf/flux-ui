import Preview from "./slider.preview.js";
import code from "./slider.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "The browser owns range keyboard and pointer behavior. Use a label and aria-valuetext when the units need explanation.",
    "This component is single-thumb only. It does not promise multi-thumb, custom orientation or logarithmic scales.",
    "Native form values are strings; onValueChange supplies the input valueAsNumber.",
  ],
  props: [
    [
      "min / max / step",
      "Native input attributes",
      "The browser clamps and steps the range.",
    ],
    [
      "value / defaultValue",
      "Native input value",
      "Controlled or native initial value.",
    ],
    [
      "onValueChange",
      "(number, event) => void",
      "Optional numeric callback after the native onChange handler.",
    ],
  ],
} satisfies ComponentExample;
