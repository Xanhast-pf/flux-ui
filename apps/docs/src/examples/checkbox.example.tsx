import {
  CheckboxDemo as Preview,
  CheckboxStateOverview,
} from "./checkbox.preview.js";
import code from "./checkbox.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  previewTitle: "Preference form",
  previewDescription:
    "A complete form example shows uncontrolled, controlled, mixed, required, and disabled checkbox behavior together.",
  variations: [
    {
      title: "State overview",
      description:
        "The core visual states can also be scanned quickly without the surrounding form workflow.",
      Preview: CheckboxStateOverview,
    },
  ],
  code,
  notes: [
    "Native checked and mixed states, keyboard behavior, and form submission.",
    "Use native attributes, className, style and composition for customization.",
  ],
  props: [
    [
      "checked / defaultChecked",
      "boolean",
      "Controlled checked state or native initial state.",
    ],
    [
      "indeterminate",
      "boolean",
      "Mixed visual state, independent of form submission.",
    ],
    [
      "onCheckedChange",
      "(checked, event) => void",
      "Optional convenience callback after onChange.",
    ],
  ],
} satisfies ComponentExample;
