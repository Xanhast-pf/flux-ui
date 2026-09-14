import Preview from "./input-group.preview.js";
import code from "./input-group.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Compose Field.Control around InputGroup.Input, not around the entire group.",
    "Use Addon for prefixes, suffixes or public buttons. Hide only decorative content from assistive technology.",
    "Native input props and refs remain available. The group owns a shared focus boundary and no application-specific styling is required.",
  ],
  props: [
    ["Root / Addon", "native props", "Group frame and adornment composition."],
    ["Input", "InputProps", "Full native input props and ref."],
  ],
} satisfies ComponentExample;
