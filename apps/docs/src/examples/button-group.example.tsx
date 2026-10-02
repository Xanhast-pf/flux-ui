import Preview from "./button-group.preview.js";
import code from "./button-group.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "orientation",
      '"horizontal" | "vertical"',
      "Controls attached-edge layout. Defaults to horizontal.",
    ],
    [
      "children",
      "native/Flux buttons",
      "Children retain their own tone, variant, size, loading, disabled and click behavior.",
    ],
  ],
  notes: [
    "ButtonGroup supplies semantic grouping and attached geometry only; it does not copy Button appearance props onto the parent.",
    "Button focus remains native Tab order. There is no roving focus or selection state.",
    "Use ToggleGroup when the buttons represent a selectable single/multiple value.",
  ],
} satisfies ComponentExample;
