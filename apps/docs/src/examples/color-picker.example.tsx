import type { ComponentExample } from "../lib/examples.js";
import Preview from "./color-picker.preview.js";
import code from "./color-picker.preview.tsx?raw";

export default {
  Preview,
  code,
  notes: [
    "ColorPicker composes the browser's native color chooser with an editable six-digit hex field; alpha and design-tool channels are intentionally out of scope.",
    "The root is a named group. Its native color input owns form participation while the hex field mirrors the same committed value.",
    "Use value/onValueChange for controlled state or defaultValue for browser-local state.",
  ],
  props: [
    [
      "value / defaultValue",
      "string",
      "Controlled or initial #RGB/#RRGGBB color.",
    ],
    [
      "onValueChange",
      "(value: string) => void",
      "Receives normalized six-digit lowercase hex values.",
    ],
    [
      "name / form",
      "string",
      "Optional native form association carried by the color input.",
    ],
    ["disabled", "boolean", "Disables both editing surfaces."],
    [
      "aria-label / aria-labelledby",
      "Accessible name",
      "Required name for the picker group.",
    ],
  ],
} satisfies ComponentExample;
