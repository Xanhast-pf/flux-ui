import {
  Card,
  Collapsible,
  DescriptionList,
  Heading,
  Inline,
  Link,
  Meter,
  PageHeader,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@flux-ui/react";
import { health } from "../generated/health.js";
import { formatMs, formatRatio, MAX_PERF_RATIO_METER } from "../lib/format.js";
import { ComparisonBars } from "../ui/ComparisonBars.js";
export function PerformancePage() {
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="lg">
        <PageHeader title={<>Runtime benchmark health</>}>
          <Text as="p" variant="body">
            Playwright runs Chromium benchmarks against equivalent native React
            implementations. CI gates synchronous mount, update, and unmount
            ratios; next-frame measurements remain diagnostics.
          </Text>
        </PageHeader>

        <Text as="p" variant="caption" tone="muted">
          Committed historical baselines, not measurements of the current page
          or the latest CI run.{" "}
          <Link href="#lab">Run your own experiment →</Link>
        </Text>
        {health.performance.scenarios.map((scenario) => {
          const reference = scenario.medians[scenario.reference];
          const flux = scenario.medians.flux;
          return (
            <Card key={scenario.name} as="article" padding={6}>
              <Stack gap="lg">
                <Stack gap="md">
                  <Stack gap="md">
                    <Heading level={2} size="lg">
                      {scenario.name} × {scenario.count}
                    </Heading>
                    <Text as="p" variant="body">
                      Reference:{" "}
                      <Text as="strong" weight="bold">
                        {scenario.reference}
                      </Text>
                    </Text>
                  </Stack>

                  <ComparisonBars
                    label="Committed synchronous mount median"
                    native={reference.mount}
                    flux={flux.mount}
                  />
                  <ComparisonBars
                    label="Committed synchronous update median"
                    native={reference.update}
                    flux={flux.update}
                  />
                  <ScrollArea
                    aria-label={`${scenario.name} measurement table`}
                    axis="horizontal"
                  >
                    <Table.Root>
                      <Table.Caption>
                        {scenario.name} runtime medians
                      </Table.Caption>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader>Metric</Table.ColumnHeader>
                          <Table.ColumnHeader>Reference</Table.ColumnHeader>
                          <Table.ColumnHeader>Flux</Table.ColumnHeader>
                          <Table.ColumnHeader>
                            Flux/reference
                          </Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.RowHeader>Mount</Table.RowHeader>
                          <Table.Cell>{formatMs(reference.mount)}</Table.Cell>
                          <Table.Cell>{formatMs(flux.mount)}</Table.Cell>
                          <Table.Cell>
                            {formatRatio(scenario.ratios.mount)}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.RowHeader>Update</Table.RowHeader>
                          <Table.Cell>{formatMs(reference.update)}</Table.Cell>
                          <Table.Cell>{formatMs(flux.update)}</Table.Cell>
                          <Table.Cell>
                            {formatRatio(scenario.ratios.update)}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.RowHeader>Unmount</Table.RowHeader>
                          <Table.Cell>{formatMs(reference.unmount)}</Table.Cell>
                          <Table.Cell>{formatMs(flux.unmount)}</Table.Cell>
                          <Table.Cell>
                            {formatRatio(scenario.ratios.unmount)}
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </ScrollArea>

                  <Text as="p" variant="body">
                    <Inline as="span" gap="sm" wrap>
                      Mount overhead ratio{" "}
                      <Meter
                        aria-label="Mount overhead ratio"
                        min={0}
                        max={MAX_PERF_RATIO_METER}
                        value={Math.min(
                          scenario.ratios.mount,
                          MAX_PERF_RATIO_METER,
                        )}
                      >
                        {scenario.ratios.mount}
                      </Meter>
                    </Inline>
                  </Text>

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
                          {formatMs(reference.mountToFrame)}
                        </DescriptionList.Details>
                        <DescriptionList.Term>
                          Flux mount → frame
                        </DescriptionList.Term>
                        <DescriptionList.Details>
                          {formatMs(flux.mountToFrame)}
                        </DescriptionList.Details>
                        <DescriptionList.Term>
                          Mount → frame ratio
                        </DescriptionList.Term>
                        <DescriptionList.Details>
                          {formatRatio(scenario.ratios.mountToFrame)}
                        </DescriptionList.Details>
                        <DescriptionList.Term>
                          Reference update → frame
                        </DescriptionList.Term>
                        <DescriptionList.Details>
                          {formatMs(reference.updateToFrame)}
                        </DescriptionList.Details>
                        <DescriptionList.Term>
                          Flux update → frame
                        </DescriptionList.Term>
                        <DescriptionList.Details>
                          {formatMs(flux.updateToFrame)}
                        </DescriptionList.Details>
                        <DescriptionList.Term>
                          Update → frame ratio
                        </DescriptionList.Term>
                        <DescriptionList.Details>
                          {formatRatio(scenario.ratios.updateToFrame)}
                        </DescriptionList.Details>
                      </DescriptionList>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </Stack>
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
}
