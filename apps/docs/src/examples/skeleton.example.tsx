import Preview from "./skeleton.preview.js";
import code from "./skeleton.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  previewLayout: "fill",
  code,
  props: [
    ["shape", "line | block | circle", "Default loading silhouettes."],
    [
      "style / className",
      "native span styling",
      "Choose layout dimensions without another sizing API.",
    ],
  ],
  notes: [
    "Always decorative and aria-hidden. Announce loading once on the surrounding operation, not once per placeholder.",
    "Skeleton never mounts hidden real content. The caller replaces placeholders when data is ready.",
    "The default is static: no shimmer loop, timer, or reduced-motion exception is needed.",
  ],
} satisfies ComponentExample;
