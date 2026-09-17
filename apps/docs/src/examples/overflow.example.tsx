import Preview from "./overflow.preview.js";
import code from "./overflow.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  notes: [
    "Wrap one Tabs collection in Overflow. Fragments and application wrappers work; nested Overflow providers are independent. Other components pass through unchanged.",
    "Tabs retains selection, orientation, aliases and keyboard behavior. Explicit wrapped lists keep their layout. Vertical lists require a constrained height to overflow.",
    "More items is a native Select picker: the browser supplies option navigation, typeahead, Escape and focus handling. Disabled tabs stay disabled. Overflowed original tabs remain inert and visually hidden; picker options activate the original tabs.",
    "Server output uses ordinary scrolling Tabs. Measurement begins after hydration without remounting the collection. Before enhancement or without ResizeObserver, native scrolling remains usable.",
    "The selected tab stays in the list, including when too large to fit; native scrolling keeps it reachable. Overflow owns all enhancement styles and observers.",
  ],
  props: [
    ["children", "ReactNode", "One supported Flux collection; currently Tabs."],
    [
      "Native div props",
      "HTML attributes",
      "className, style, ref and data attributes customize the wrapper. Use normal container sizing to control available space.",
    ],
  ],
} satisfies ComponentExample;
