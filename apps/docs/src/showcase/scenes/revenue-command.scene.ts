import { GaugeIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";

export default {
  order: 0,
  label: "Revenue",
  brand: "Northstar",
  headline: "Run the business from one clear revenue picture.",
  description:
    "An executive revenue workspace with trends, product mix, accounts, forecasting, and real filtering controls.",
  prompt:
    "Change the reporting window, inspect the charts, open the forecast dialog, and select accounts.",
  components: [
    "avatar",
    "breadcrumbs",
    "button",
    "card",
    "chart",
    "chart-legend",
    "chart-tooltip",
    "data-table",
    "date-picker",
    "dialog",
    "dropdown-menu",
    "field",
    "grid",
    "heading",
    "inline",
    "number-field",
    "pie-chart",
    "progress",
    "select",
    "sparkline",
    "stack",
    "stat",
    "status-badge",
    "text",
    "toggle-group",
  ],
  custom:
    "Only fictional business data and local React state. Every visible dashboard surface is composed from public Flux components with no scene-specific stylesheet or private UI primitive.",
  Icon: GaugeIcon,
} satisfies SceneDefinition;
