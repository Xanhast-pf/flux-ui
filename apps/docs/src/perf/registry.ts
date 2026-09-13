import type { ScenarioDefinition, ScenarioModule } from "./scenario.types.js";
const MAX_SCENARIO_COUNT = 20_000;
const manifests = import.meta.glob<ScenarioDefinition>("./scenarios/*.json", {
  eager: true,
  import: "default",
});
const fixtures = import.meta.glob<ScenarioModule>("./scenarios/*.fixture.tsx");
export const scenarioCatalog = Object.values(manifests).sort((a, b) =>
  a.label.localeCompare(b.label),
);
const ids = new Set<string>();
for (const entry of scenarioCatalog) {
  if (
    !/^[a-z][a-z0-9-]+$/u.test(entry.id) ||
    !entry.description ||
    !["comparison", "workload"].includes(entry.kind) ||
    entry.fixtureRevision < 1 ||
    ids.has(entry.id) ||
    !entry.label ||
    !entry.unit ||
    !Number.isInteger(entry.maxCount) ||
    entry.maxCount < 100 ||
    entry.maxCount > MAX_SCENARIO_COUNT ||
    !Number.isInteger(entry.fixtureRevision) ||
    !fixtures[`./scenarios/${entry.id}.fixture.tsx`]
  )
    throw new Error("Invalid or unpaired performance scenario manifest.");
  ids.add(entry.id);
}
export function getScenario(id: string): ScenarioDefinition {
  const entry = scenarioCatalog.find((item) => item.id === id);
  if (!entry) throw new Error(`Unknown performance scenario: ${id}`);
  return entry;
}
export async function loadScenario(id: string) {
  getScenario(id);
  const load = fixtures[`./scenarios/${id}.fixture.tsx`];
  if (!load) throw new Error(`Missing performance fixture: ${id}`);
  return (await load()).default;
}
