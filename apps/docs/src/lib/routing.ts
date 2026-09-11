import { useSyncExternalStore } from "react";
export const sections = [
  ["overview", "Overview"],
  ["playground", "Playground"],
  ["components", "Components"],
  ["icons", "Icons"],
  ["identity", "Identity"],
  ["tokens", "Design tokens"],
  ["lab", "Live Stress Lab"],
  ["engineering", "Engineering"],
  ["trust", "Trust Center"],
  ["accessibility", "Live accessibility"],
  ["health", "Repository health"],
  ["size", "Bundle size"],
  ["performance", "Runtime performance"],
  ["rules", "Engineering rules"],
  ["install", "Getting started"],
  ["documentation", "Documentation"],
] as const;
function subscribe(listener: () => void): () => void {
  window.addEventListener("hashchange", listener);
  return () => {
    window.removeEventListener("hashchange", listener);
  };
}
function snapshot(): string {
  return window.location.hash.slice(1) || "overview";
}
export function useRoute(): string {
  return useSyncExternalStore(subscribe, snapshot, () => "overview");
}
