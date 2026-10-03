import Preview from "./textarea.preview.js";
import code from "./textarea.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Native multi-line text entry with Flux styling and Field composition.",
    "autoSize uses the platform field-sizing implementation; it does not add a measurement mirror, ResizeObserver, or JavaScript height loop.",
    "rows belongs to fixed mode. Autosize mode uses minRows/maxRows so the sizing contract cannot contradict itself.",
    "Native values, reset behavior, events, form submission, refs, className and style remain available.",
  ],
  props: [
    ["autoSize", "boolean", "Enables CSS-native content-sized growth."],
    [
      "minRows / maxRows",
      "positive integer",
      "Optional autosize row bounds. minRows defaults to one; maxRows is unbounded when omitted.",
    ],
    ["rows / cols", "number", "Native visible size hints for fixed mode."],
    [
      "value / defaultValue / onChange",
      "Native textarea props",
      "Controlled or browser-owned text.",
    ],
    [
      "Native props",
      "textarea attributes",
      "Required, disabled, readOnly, form, ref and styling.",
    ],
  ],
} satisfies ComponentExample;
