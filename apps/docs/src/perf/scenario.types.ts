import type { ComponentType } from "react";
import type { components } from "../generated/components.js";

export type PerfScenario = (typeof components)[number]["slug"];
export type PerfVariant = "raw" | "native" | "flux";
export type ScenarioSource = "dedicated" | "preview";

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
  source: ScenarioSource;
  maxCount: number;
  fixtureRevision: number;
  description: string;
}

export type ScenarioManifest = Omit<ScenarioDefinition, "source">;

export interface ScenarioModule {
  default: ComponentType<ScenarioProps>;
}
