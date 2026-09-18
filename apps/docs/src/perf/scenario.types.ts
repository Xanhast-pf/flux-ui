import type { ComponentType } from "react";
export type PerfScenario =
  | "button"
  | "chart"
  | "checkbox"
  | "code-block"
  | "data-table"
  | "field"
  | "grid"
  | "knob"
  | "level-meter"
  | "tabs"
  | "sidebar"
  | "slider"
  | "split-pane"
  | "stack"
  | "text";
export type PerfVariant = "raw" | "native" | "flux";
export interface ScenarioProps {
  count: number;
  revision: number;
  variant: PerfVariant;
}
export interface ScenarioDefinition {
  id: PerfScenario;
  label: string;
  unit: string;
  kind: "comparison" | "workload";
  maxCount: number;
  fixtureRevision: number;
  description: string;
}
export interface ScenarioModule {
  default: ComponentType<ScenarioProps>;
}
