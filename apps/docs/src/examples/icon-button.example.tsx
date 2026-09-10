import Preview from "./icon-button.preview.js";
import code from "./icon-button.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  props: [
    [
      "Accessible name",
      "aria-label | aria-labelledby",
      "One is required. A tooltip is not a substitute for a button name.",
    ],
    [
      "size / variant / tone / loading",
      "Button props",
      "Preserves the Button prop contract with a lightweight native button and static CSS.",
    ],
    [
      "Native props",
      "button attributes",
      "Refs, events, disabled, style and data attributes pass through.",
    ],
  ],
  notes: [
    'Keep the action name meaningful without the icon. Give decorative icons aria-hidden="true".',
    'Buttons default to type="button". Explicit submit remains available.',
    "Loading uses the same disabled and busy contract as Button.",
  ],
} satisfies ComponentExample;
