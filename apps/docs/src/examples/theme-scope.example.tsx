import type { ComponentExample } from "../lib/examples.js";
import Preview from "./theme-scope.preview.js";
import code from "./theme-scope.preview.tsx?raw";
export default {
  Preview,
  previewLayout: "fill",
  code,
  notes: [
    "Import @flux-ui/tokens/presets.css only when using Paper, Studio, Bloom or Terminal. Custom theme names can be defined in consumer CSS.",
    "Changing theme updates inherited variables without changing descendant keys or resetting their React state.",
    'query creates the named ancestor used by responsiveTo="container". The scope does not query its own size.',
  ],
  props: [
    [
      "theme",
      "string",
      "Required local data-flux-theme value; does not mutate document preferences.",
    ],
    ["query", "boolean", "Opt into a named inline-size query container."],
    [
      "Box props",
      "Surface and native props",
      "Semantic element, spacing, surface, native ref and attributes.",
    ],
  ],
} satisfies ComponentExample;
