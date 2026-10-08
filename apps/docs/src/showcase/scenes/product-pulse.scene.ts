import { SparkIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";

export default {
  order: 1,
  label: "Product",
  brand: "Beacon",
  headline: "See what users love, where they struggle, and what to ship next.",
  description:
    "A product-intelligence dashboard blending adoption, cohorts, experiments, qualitative confidence, and performance signals.",
  prompt:
    "Filter a team, change confidence, toggle chart series, inspect an experiment, and adjust guardrails.",
  components: [
    "accordion",
    "button",
    "callout",
    "card",
    "chart",
    "chart-legend",
    "chart-tooltip",
    "combobox",
    "field",
    "grid",
    "heading",
    "icon-button",
    "inline",
    "meter",
    "pie-chart",
    "popover",
    "rating",
    "scatter-chart",
    "select",
    "slider",
    "stack",
    "stat",
    "status-badge",
    "switch",
    "tabs",
    "tag",
    "text",
    "toggle-group",
    "tooltip",
  ],
  custom:
    "Only fictional analytics data and local state. Every visible control, chart, disclosure, surface, and overlay is a public Flux component.",
  Icon: SparkIcon,
} satisfies SceneDefinition;
