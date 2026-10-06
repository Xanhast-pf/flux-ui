import {
  Callout,
  Card,
  Collapsible,
  DescriptionList,
  Field,
  Grid,
  Heading,
  Inline,
  Link,
  Meter,
  PageHeader,
  ScrollArea,
  Select,
  Stack,
  StatusBadge,
  Table,
  Text,
} from "@flux-ui/react";
import { useState } from "react";
import { components } from "../generated/components.js";
import { health } from "../generated/health.js";
import { formatMs, formatRatio, MAX_PERF_RATIO_METER } from "../lib/format.js";
import { scenarioCatalog } from "../perf/registry.js";

const DEFAULT_COMPONENT_SLUG = "button";
const dedicatedScenarioCount = scenarioCatalog.filter(
  (entry) => entry.source === "dedicated",
).length;
const previewScenarioCount = scenarioCatalog.length - dedicatedScenarioCount;

function RuntimeComparison({
  label,
  referenceLabel,
  reference,
  flux,
}: {
  label: string;
  referenceLabel: string;
  reference: number;
  flux: number;
}) {
  const maximum = Math.max(reference, flux, 0.01);

  return (
    <Stack role="group" aria-label={label} gap="md">
      <Text as="p" weight="medium">
        {label}
      </Text>
      {[
        { name: referenceLabel, value: reference },
        { name: "Flux UI", value: flux },
      ].map((entry) => (
        <Stack key={entry.name} gap="xs">
          <Grid templateColumns="minmax(0, 1fr) auto" gap="sm">
            <Text>{entry.name}</Text>
            <Text numeric align="end" weight="medium">
              {formatMs(entry.value)}
            </Text>
          </Grid>
          <Meter
            aria-label={`${entry.name} ${label} milliseconds`}
            value={entry.value}
            max={maximum}
          />
        </Stack>
      ))}
    </Stack>
  );
}

function getComponent(slug: string) {
  const component = components.find((entry) => entry.slug === slug);
  if (!component) throw new Error(`Unknown component: ${slug}`);
  return component;
}

function initialComponentSlug(): string {
  const query = window.location.hash.split("?", 2)[1] ?? "";
  const requested = new URLSearchParams(query).get("component");
  return requested !== null &&
    components.some((entry) => entry.slug === requested)
    ? requested
    : DEFAULT_COMPONENT_SLUG;
}

export function PerformancePage() {
  const [componentSlug, setComponentSlug] = useState(initialComponentSlug);
  const component = getComponent(componentSlug);
  const definition = scenarioCatalog.find(
    (entry) => entry.id === componentSlug,
  );
  const recorded = health.performance.scenarios.find(
    (entry) => entry.name === componentSlug,
  );
  const baselineIsCurrent =
    recorded !== undefined &&
    definition !== undefined &&
    definition.source === "dedicated" &&
    Number(recorded.fixtureRevision) === definition.fixtureRevision;
  const baseline = baselineIsCurrent ? recorded : undefined;

  const evidenceLabel =
    baseline !== undefined
      ? "Committed benchmark baseline"
      : definition !== undefined
        ? definition.kind === "comparison"
          ? "Browser comparison"
          : definition.source === "preview"
            ? "Representative browser workload"
            : "Browser workload"
        : "Microbenchmark coverage";

  return (
    <Stack className="reference-page" as="section" gap="lg">
      <PageHeader title={<>Runtime performance</>}>
        <Text as="p" variant="body">
          Choose any public component. Every component has a browser workload:
          purpose-built scenarios where Flux has a meaningful stress or matched
          comparison fixture, otherwise one representative mount/update/unmount
          of the component&apos;s default public docs preview.
        </Text>
      </PageHeader>

      <Text as="p" variant="caption" tone="muted">
        {components.length} public components · {dedicatedScenarioCount}{" "}
        purpose-built browser scenarios · {previewScenarioCount} representative
        preview workloads · {health.performance.scenarios.length} committed
        regression baselines. Preview workloads are device-local representative
        compositions, not isolated component-cost or native-equivalence claims.
        The checked-in Chromium values remain the CI regression contract.{" "}
        <Link
          href={
            definition === undefined ? "#lab" : `#lab?scenario=${definition.id}`
          }
        >
          Run this browser workload →
        </Link>
      </Text>

      <Card as="article" padding={6}>
        <Stack gap="lg">
          <Field.Root controlId="runtime-performance-component">
            <Field.Label>Component</Field.Label>
            <Field.Control>
              <Select
                value={componentSlug}
                onChange={(event) => {
                  setComponentSlug(event.currentTarget.value);
                }}
              >
                {components.map((entry) => (
                  <option key={entry.slug} value={entry.slug}>
                    {entry.name}
                  </option>
                ))}
              </Select>
            </Field.Control>
            <Field.Description>
              Select from the complete generated component catalog.
            </Field.Description>
          </Field.Root>

          <Stack gap="md">
            <Inline gap="sm" wrap>
              <StatusBadge tone="accent">{component.category}</StatusBadge>
              <StatusBadge>{component.status}</StatusBadge>
              <StatusBadge
                tone={
                  baseline !== undefined
                    ? "success"
                    : definition !== undefined
                      ? "info"
                      : "neutral"
                }
              >
                {evidenceLabel}
              </StatusBadge>
            </Inline>

            <Heading level={2} size="lg">
              {component.name}
            </Heading>
            <Text as="p" variant="body" tone="muted">
              {component.description}
            </Text>
          </Stack>

          {recorded !== undefined && !baselineIsCurrent ? (
            <Stack gap="md">
              <Callout tone="warning">
                The committed benchmark timing uses an older browser fixture and
                is not comparable to the current implementation. No historical
                ratio is shown until a deliberately reviewed baseline is
                accepted.
              </Callout>
              {definition !== undefined && (
                <DescriptionList>
                  <DescriptionList.Term>Browser scenario</DescriptionList.Term>
                  <DescriptionList.Details>
                    {definition.label}
                  </DescriptionList.Details>
                  <DescriptionList.Term>Work unit</DescriptionList.Term>
                  <DescriptionList.Details>
                    {definition.unit}
                  </DescriptionList.Details>
                  <DescriptionList.Term>Committed fixture</DescriptionList.Term>
                  <DescriptionList.Details>
                    Revision {recorded.fixtureRevision}
                  </DescriptionList.Details>
                  <DescriptionList.Term>Current fixture</DescriptionList.Term>
                  <DescriptionList.Details>
                    Revision {definition.fixtureRevision}
                  </DescriptionList.Details>
                </DescriptionList>
              )}
              {definition !== undefined && (
                <Link href={`#lab?scenario=${definition.id}`}>
                  Measure the current workload locally →
                </Link>
              )}
            </Stack>
          ) : baseline !== undefined && definition !== undefined ? (
            <Stack gap="lg">
              <DescriptionList>
                <DescriptionList.Term>Evidence</DescriptionList.Term>
                <DescriptionList.Details>
                  Native-relative Chromium baseline · CI regression contract
                </DescriptionList.Details>
                <DescriptionList.Term>Workload</DescriptionList.Term>
                <DescriptionList.Details>
                  {baseline.count.toLocaleString()} {definition.unit}
                </DescriptionList.Details>
                <DescriptionList.Term>Reference</DescriptionList.Term>
                <DescriptionList.Details>
                  Matched native React
                </DescriptionList.Details>
                <DescriptionList.Term>Policy</DescriptionList.Term>
                <DescriptionList.Details>
                  v{health.performance.policyVersion}
                </DescriptionList.Details>
                <DescriptionList.Term>Fixture</DescriptionList.Term>
                <DescriptionList.Details>
                  Revision {definition.fixtureRevision}
                </DescriptionList.Details>
              </DescriptionList>

              <Text as="p" variant="body" tone="muted">
                {definition.description}
              </Text>

              <RuntimeComparison
                label="Committed synchronous mount median"
                referenceLabel="Native React"
                reference={baseline.medians[baseline.reference].mount}
                flux={baseline.medians.flux.mount}
              />
              <RuntimeComparison
                label="Committed synchronous update median"
                referenceLabel="Native React"
                reference={baseline.medians[baseline.reference].update}
                flux={baseline.medians.flux.update}
              />

              <ScrollArea
                aria-label={`${component.name} measurement table`}
                axis="horizontal"
              >
                <Table.Root>
                  <Table.Caption>
                    {component.name} committed runtime medians
                  </Table.Caption>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Metric</Table.ColumnHeader>
                      <Table.ColumnHeader>Reference</Table.ColumnHeader>
                      <Table.ColumnHeader>Flux</Table.ColumnHeader>
                      <Table.ColumnHeader>Flux/reference</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.RowHeader>Mount</Table.RowHeader>
                      <Table.Cell>
                        {formatMs(baseline.medians[baseline.reference].mount)}
                      </Table.Cell>
                      <Table.Cell>
                        {formatMs(baseline.medians.flux.mount)}
                      </Table.Cell>
                      <Table.Cell>
                        {formatRatio(baseline.ratios.mount)}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.RowHeader>Update</Table.RowHeader>
                      <Table.Cell>
                        {formatMs(baseline.medians[baseline.reference].update)}
                      </Table.Cell>
                      <Table.Cell>
                        {formatMs(baseline.medians.flux.update)}
                      </Table.Cell>
                      <Table.Cell>
                        {formatRatio(baseline.ratios.update)}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.RowHeader>Unmount</Table.RowHeader>
                      <Table.Cell>
                        {formatMs(baseline.medians[baseline.reference].unmount)}
                      </Table.Cell>
                      <Table.Cell>
                        {formatMs(baseline.medians.flux.unmount)}
                      </Table.Cell>
                      <Table.Cell>
                        {formatRatio(baseline.ratios.unmount)}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </ScrollArea>

              <Stack gap="sm">
                <Text as="p" weight="medium">
                  Mount overhead ratio
                </Text>
                <Meter
                  aria-label="Mount overhead ratio"
                  min={0}
                  max={MAX_PERF_RATIO_METER}
                  value={Math.min(baseline.ratios.mount, MAX_PERF_RATIO_METER)}
                >
                  {baseline.ratios.mount}
                </Meter>
                <Text as="p" variant="caption" tone="muted">
                  {formatRatio(baseline.ratios.mount)} relative to the matched
                  native reference.
                </Text>
              </Stack>

              <Collapsible.Root>
                <Collapsible.Trigger>
                  Next-frame diagnostics
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <DescriptionList>
                    <DescriptionList.Term>
                      Reference mount → frame
                    </DescriptionList.Term>
                    <DescriptionList.Details>
                      {formatMs(
                        baseline.medians[baseline.reference].mountToFrame,
                      )}
                    </DescriptionList.Details>
                    <DescriptionList.Term>
                      Flux mount → frame
                    </DescriptionList.Term>
                    <DescriptionList.Details>
                      {formatMs(baseline.medians.flux.mountToFrame)}
                    </DescriptionList.Details>
                    <DescriptionList.Term>
                      Mount → frame ratio
                    </DescriptionList.Term>
                    <DescriptionList.Details>
                      {formatRatio(baseline.ratios.mountToFrame)}
                    </DescriptionList.Details>
                    <DescriptionList.Term>
                      Reference update → frame
                    </DescriptionList.Term>
                    <DescriptionList.Details>
                      {formatMs(
                        baseline.medians[baseline.reference].updateToFrame,
                      )}
                    </DescriptionList.Details>
                    <DescriptionList.Term>
                      Flux update → frame
                    </DescriptionList.Term>
                    <DescriptionList.Details>
                      {formatMs(baseline.medians.flux.updateToFrame)}
                    </DescriptionList.Details>
                    <DescriptionList.Term>
                      Update → frame ratio
                    </DescriptionList.Term>
                    <DescriptionList.Details>
                      {formatRatio(baseline.ratios.updateToFrame)}
                    </DescriptionList.Details>
                  </DescriptionList>
                </Collapsible.Content>
              </Collapsible.Root>
            </Stack>
          ) : definition !== undefined ? (
            <Stack gap="md">
              <Callout>
                {definition.source === "preview" ? (
                  <>
                    This component has a representative browser workload backed
                    by its default public docs preview, but no committed
                    benchmark baseline. It measures the composition as shown,
                    not the component in isolation.
                  </>
                ) : (
                  <>
                    This component has a registered browser{" "}
                    {definition.kind === "comparison"
                      ? "comparison"
                      : "workload scenario"}
                    , but it does not have a committed benchmark baseline. Flux
                    does not invent a native-relative ratio where none has been
                    reviewed.
                  </>
                )}
              </Callout>
              <DescriptionList>
                <DescriptionList.Term>Browser scenario</DescriptionList.Term>
                <DescriptionList.Details>
                  {definition.label}
                </DescriptionList.Details>
                <DescriptionList.Term>Evidence type</DescriptionList.Term>
                <DescriptionList.Details>
                  {definition.kind === "comparison"
                    ? "Matched browser comparison"
                    : definition.source === "preview"
                      ? "Representative public preview"
                      : "Flux workload"}
                </DescriptionList.Details>
                <DescriptionList.Term>Work unit</DescriptionList.Term>
                <DescriptionList.Details>
                  {definition.unit}
                </DescriptionList.Details>
                <DescriptionList.Term>Fixture</DescriptionList.Term>
                <DescriptionList.Details>
                  Revision {definition.fixtureRevision}
                </DescriptionList.Details>
              </DescriptionList>
              <Text as="p" variant="body" tone="muted">
                {definition.description}
              </Text>
              <Link href={`#lab?scenario=${definition.id}`}>
                Run {definition.label}{" "}
                {definition.source === "preview"
                  ? "representative workload"
                  : "in the Stress Lab"}{" "}
                →
              </Link>
            </Stack>
          ) : (
            <Stack gap="md">
              <Callout>
                No dedicated browser runtime scenario has been committed for{" "}
                {component.name} yet. The component still has the repository's
                required microbenchmark coverage, but this page does not turn
                that diagnostic benchmark into a browser-runtime claim.
              </Callout>
              <DescriptionList>
                <DescriptionList.Term>Component benchmark</DescriptionList.Term>
                <DescriptionList.Details>
                  Required `.bench.tsx` microbenchmark
                </DescriptionList.Details>
                <DescriptionList.Term>Browser scenario</DescriptionList.Term>
                <DescriptionList.Details>
                  Not registered
                </DescriptionList.Details>
                <DescriptionList.Term>
                  Committed browser baseline
                </DescriptionList.Term>
                <DescriptionList.Details>Not available</DescriptionList.Details>
              </DescriptionList>
              <Inline gap="md" wrap>
                <Link href={`#components/${component.slug}`}>
                  Inspect {component.name} →
                </Link>
                <Link href="#lab">Open the Stress Lab →</Link>
              </Inline>
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
