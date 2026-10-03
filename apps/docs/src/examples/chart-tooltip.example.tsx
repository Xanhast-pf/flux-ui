import Preview from "./chart-tooltip.preview.js";
import code from "./chart-tooltip.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "ChartTooltip is an optional visual projection for Chart, PieChart and ScatterChart. It is separate from Tooltip, which remains supplemental help for a labelled control.",
    "trigger=hover follows chart pointer inspection and hides on pointer leave. trigger=click persists the selected chart value; Escape dismisses it.",
    "The popup is aria-hidden and pointer-inert. The wrapped chart's slider-style inspector remains the accessible data owner for keyboard and assistive-technology users.",
    "renderContent receives normalized label/items/x/y data when product presentation needs more than the default compact rows; the example customizes that content while composing inside ChartLegend.",
    "ChartTooltip stays inside its wrapper and uses lightweight edge-aware start/end and above/below anchoring so compact plots do not crush the popup; it adds no portal, Popper dependency or global event manager.",
  ],
  props: [
    [
      "trigger",
      "hover | click",
      "Pointer event that opens/updates the visual data tooltip.",
    ],
    [
      "renderContent",
      "(data) => ReactNode",
      "Optional custom visual renderer for normalized chart data.",
    ],
    [
      "children",
      "ReactNode",
      "A Chart, PieChart or ScatterChart, with ChartLegend or other layout freely composed around it.",
    ],
  ],
} satisfies ComponentExample;
