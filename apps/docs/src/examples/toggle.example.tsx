import Preview from "./toggle.preview.js";
import code from "./toggle.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  props: [
    [
      "pressed / defaultPressed",
      "boolean",
      "Controlled pressed state or an initial uncontrolled value.",
    ],
    [
      "onPressedChange",
      "(pressed, event) => void",
      "Runs after onClick unless it was canceled.",
    ],
    [
      "Native props",
      "button attributes",
      "Native keyboard, disabled, type, events and refs remain available.",
    ],
  ],
  notes: [
    "The label stays constant while aria-pressed changes. Do not rename the button to Unsave when pressed.",
    "Space and Enter activate the native button. A toggle is an action, not a form checkbox.",
    "onClick can preventDefault to cancel the state change and convenience callback.",
  ],
} satisfies ComponentExample;
