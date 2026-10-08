import { catalog as componentCatalog } from "../lib/examples.js";
import { createPreviewScenario } from "./previewScenario.js";
import type {
  ScenarioDefinition,
  ScenarioManifest,
  ScenarioModule,
} from "./scenario.types.js";

const MAX_SCENARIO_COUNT = 20_000;
const manifests = import.meta.glob<ScenarioManifest>("./scenarios/*.json", {
  eager: true,
  import: "default",
});
const fixtures = import.meta.glob<ScenarioModule>("./scenarios/*.fixture.tsx");

const dedicatedCatalog = Object.values(manifests).map(
  (entry): ScenarioDefinition => ({ ...entry, source: "dedicated" }),
);
const dedicatedIds = new Set<string>();

for (const entry of dedicatedCatalog) {
  if (
    !/^[a-z][a-z0-9-]+$/u.test(entry.id) ||
    !entry.description ||
    !["comparison", "workload"].includes(entry.kind) ||
    entry.fixtureRevision < 1 ||
    dedicatedIds.has(entry.id) ||
    !componentCatalog.some((component) => component.slug === entry.id) ||
    !entry.label ||
    !entry.unit ||
    !Number.isInteger(entry.maxCount) ||
    entry.maxCount < 100 ||
    entry.maxCount > MAX_SCENARIO_COUNT ||
    !Number.isInteger(entry.fixtureRevision) ||
    !fixtures[`./scenarios/${entry.id}.fixture.tsx`]
  )
    throw new Error("Invalid or unpaired performance scenario manifest.");
  dedicatedIds.add(entry.id);
}

const previewCatalog = componentCatalog
  .filter((component) => !dedicatedIds.has(component.slug))
  .map((component): ScenarioDefinition => ({
    id: component.slug,
    label: component.name,
    unit: "public preview composition",
    kind: "workload",
    source: "preview",
    maxCount: 1,
    fixtureRevision: 1,
    description:
      "Mount and update the component's default public docs preview once. Representative browser composition; not an isolated component-cost or native-comparison claim.",
  }));

export const scenarioCatalog = [...dedicatedCatalog, ...previewCatalog].sort(
  (a, b) => a.label.localeCompare(b.label),
);

export function getScenario(id: string): ScenarioDefinition {
  const entry = scenarioCatalog.find((item) => item.id === id);
  if (!entry) throw new Error(`Unknown performance scenario: ${id}`);
  return entry;
}

export async function loadScenario(id: string) {
  const definition = getScenario(id);
  const fixture = fixtures[`./scenarios/${definition.id}.fixture.tsx`];
  if (fixture) return (await fixture()).default;

  const component = componentCatalog.find(
    (entry) => entry.slug === definition.id,
  );
  if (!component)
    throw new Error(`Missing performance fixture: ${definition.id}`);
  const example = await component.loadExample();
  return createPreviewScenario(example.default.Preview);
}
