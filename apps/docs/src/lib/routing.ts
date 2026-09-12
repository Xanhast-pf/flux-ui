import { useSyncExternalStore } from "react";
export const navigationGroups = [
  {
    label: "Build",
    items: [
      ["overview", "Overview"],
      ["install", "Getting started"],
      ["playground", "Playground"],
      ["components", "Components"],
      ["documentation", "Guides & FAQ"],
    ],
  },
  {
    label: "Design",
    items: [
      ["tokens", "Design tokens"],
      ["icons", "Icons"],
      ["identity", "Brand & identity"],
    ],
  },
  {
    label: "Inspect",
    items: [
      ["engineering", "Engineering"],
      ["lab", "Live Stress Lab"],
      ["size", "Bundle size"],
      ["performance", "Runtime performance"],
      ["accessibility", "Live accessibility"],
      ["trust", "Trust Center"],
      ["health", "Repository health"],
      ["rules", "Engineering rules"],
    ],
  },
] as const;
export const sections = navigationGroups.flatMap<readonly [string, string]>(
  (group) => group.items,
);
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

export function routePath(route: string): string {
  return route.split("?", 1)[0] || "overview";
}
