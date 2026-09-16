import Preview from "./input-group.preview.js";
import code from "./input-group.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Compose Field.Control around the input, not the entire group. InputGroup.Input, Input and NumberField all share the group frame without another wrapper.",
    "Use Addon for prefixes, suffixes or public buttons. Hide only decorative content from assistive technology.",
    "Native input props and refs remain available. The group owns a shared focus boundary and no application-specific styling is required.",
  ],
  props: [
    ["Root / Addon", "native props", "Group frame and adornment composition."],
    [
      "Input",
      "InputProps",
      "Convenient native input; direct Input and NumberField children are also supported.",
    ],
  ],
} satisfies ComponentExample;
