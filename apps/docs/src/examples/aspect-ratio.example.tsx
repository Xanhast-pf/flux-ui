import Preview from "./aspect-ratio.preview.js";
import code from "./aspect-ratio.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  props: [
    ["ratio", "number", "A finite positive width / height ratio, default 1."],
    [
      "Native props",
      "div attributes",
      "style.aspectRatio can override the preferred ratio; no observer or resize state.",
    ],
  ],
  notes: [
    "The browser handles sizing. Content can affect intrinsic minimum size; constrain or absolutely position media when it must fill the exact frame.",
    "Keep image alt text on the image rather than on this generic layout wrapper.",
    "Use className and native styles for object-fit, background and content positioning.",
  ],
} satisfies ComponentExample;
