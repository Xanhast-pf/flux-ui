import { Collapsible, Stack, Table } from "@flux-ui/react";
import { health } from "../generated/health.js";
import { formatMs, formatRatio, MAX_PERF_RATIO_METER } from "../lib/format.js";
export function PerformancePage() {
  return (
    <section className="reference-page">
      <Stack gap="lg">
        <div>
          <h1>Runtime benchmark health</h1>
          <p>
            Playwright runs Chromium benchmarks against equivalent native React
            implementations. CI gates synchronous mount, update, and unmount
            ratios; next-frame measurements remain diagnostics.
          </p>
        </div>

        {health.performance.scenarios.map((scenario) => {
          const reference = scenario.medians[scenario.reference];
          const flux = scenario.medians.flux;

          return (
            <article key={scenario.name} className="benchmark-card">
              <Stack gap="md">
                <div>
                  <h2>
                    {scenario.name} × {scenario.count}
                  </h2>
                  <p>
                    Reference: <strong>{scenario.reference}</strong>
                  </p>
                </div>

                <div
                  className="table-scroll"
                  role="region"
                  aria-label={`${scenario.name} measurement table`}
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
                        <Table.ColumnHeader>Flux/reference</Table.ColumnHeader>
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
                </div>

                <p>
                  <label>
                    Mount overhead ratio{" "}
                    <meter
                      min={0}
                      max={MAX_PERF_RATIO_METER}
                      value={Math.min(
                        scenario.ratios.mount,
                        MAX_PERF_RATIO_METER,
                      )}
                    >
                      {scenario.ratios.mount}
                    </meter>
                  </label>
                </p>

                <Collapsible.Root>
                  <Collapsible.Trigger>
                    Next-frame diagnostics
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <dl>
                      <dt>Reference mount → frame</dt>
                      <dd>{formatMs(reference.mountToFrame)}</dd>
                      <dt>Flux mount → frame</dt>
                      <dd>{formatMs(flux.mountToFrame)}</dd>
                      <dt>Mount → frame ratio</dt>
                      <dd>{formatRatio(scenario.ratios.mountToFrame)}</dd>
                      <dt>Reference update → frame</dt>
                      <dd>{formatMs(reference.updateToFrame)}</dd>
                      <dt>Flux update → frame</dt>
                      <dd>{formatMs(flux.updateToFrame)}</dd>
                      <dt>Update → frame ratio</dt>
                      <dd>{formatRatio(scenario.ratios.updateToFrame)}</dd>
                    </dl>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Stack>
            </article>
          );
        })}
      </Stack>
    </section>
  );
}
