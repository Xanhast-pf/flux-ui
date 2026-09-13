import { components } from "../generated/components.js";
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
  const path = route.split("?", 1)[0] || "overview";
  return path === "rules" ? "engineering" : path;
}

/** Titles describe the destination, including deep links and the legacy rules route. */
export function pageTitle(route: string): string {
  const path = routePath(route);
  if (path.startsWith("components/")) {
    const component = components.find(
      (entry) => entry.slug === path.slice("components/".length),
    );
    return component
      ? `${component.name} · Components · Flux UI`
      : "Component not found · Flux UI";
  }
  const section = sections.find(([id]) => id === path);
  return `${section?.[1] ?? "Page not found"} · Flux UI`;
}
