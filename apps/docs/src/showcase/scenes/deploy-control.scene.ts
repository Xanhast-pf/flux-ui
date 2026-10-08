import { LayersIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";

export default {
  order: 4,
  label: "Deploy",
  brand: "Launchpad",
  headline: "Ship with the confidence of a control plane, not a checklist.",
  description:
    "An engineering dashboard combining deploy health, service navigation, logs, release controls, environment settings, and operational status.",
  prompt:
    "Switch services, inspect deploy data, adjust canary traffic, open environment settings, and review the build log.",
  components: [
    "button",
    "callout",
    "card",
    "chart",
    "chart-legend",
    "chart-tooltip",
    "code",
    "code-block",
    "description-list",
    "dialog",
    "dropdown-menu",
    "field",
    "grid",
    "heading",
    "inline",
    "kbd",
    "progress",
    "select",
    "separator",
    "sidebar",
    "slider",
    "sparkline",
    "spinner",
    "stack",
    "status-badge",
    "switch",
    "table",
    "tabs",
    "text",
    "toggle",
    "tooltip",
  ],
  custom:
    "Only fictional service and deploy data plus local state. The application shell, charts, logs, tables, controls, dialogs, and status surfaces are public Flux components with no scene-specific stylesheet.",
  Icon: LayersIcon,
} satisfies SceneDefinition;
