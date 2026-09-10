import { Stack, Table } from "@flux-ui/react";
import { health } from "../generated/health.js";
import { formatBytes, budgetUsage } from "../lib/format.js";
import { MeasurementNotice } from "../ui/MeasurementNotice.js";
export function SizePage() {
  const runtimeBrotli = health.size.aggregate.runtime.brotli;
  const publishedBrotli = health.size.aggregate.published.brotli;
  return (
    <section className="reference-page">
      <Stack gap="md">
        <MeasurementNotice />
        <div>
          <h1>Bundle-size health</h1>
          <p>
            Every public component has an absolute complexity-class budget and a
            historical regression baseline. The meters below show Brotli size
            against each component&apos;s absolute budget.
          </p>
        </div>

        <div
          className="table-scroll"
          role="region"
          aria-label="Measurement table"
        >
          <Table.Root>
            <Table.Caption>
              Committed measurements (new entries stay pending until measured)
            </Table.Caption>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Component</Table.ColumnHeader>
                <Table.ColumnHeader>Class</Table.ColumnHeader>
                <Table.ColumnHeader>Raw</Table.ColumnHeader>
                <Table.ColumnHeader>Gzip</Table.ColumnHeader>
                <Table.ColumnHeader>Brotli</Table.ColumnHeader>
                <Table.ColumnHeader>Budget usage</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {health.size.components.map((component) => {
                const usage = budgetUsage(
                  component.brotli,
                  component.budgetBrotli,
                );

                return (
                  <Table.Row key={component.slug}>
                    <Table.RowHeader>{component.name}</Table.RowHeader>
                    <Table.Cell>{component.sizeClass}</Table.Cell>
                    <Table.Cell>{formatBytes(component.raw)}</Table.Cell>
                    <Table.Cell>{formatBytes(component.gzip)}</Table.Cell>
                    <Table.Cell>{formatBytes(component.brotli)}</Table.Cell>
                    <Table.Cell>
                      <meter
                        min={0}
                        max={1}
                        value={usage ?? 0}
                        aria-label={`${component.name} Brotli budget usage`}
                      />{" "}
                      {usage === null
                        ? "Pending baseline"
                        : `${(usage * 100).toFixed(1)}%`}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </div>

        <p>
          Last measured aggregate runtime:{" "}
          <strong>{formatBytes(runtimeBrotli)}</strong>. Published package:{" "}
          <strong>{formatBytes(publishedBrotli)}</strong>.
        </p>
      </Stack>
    </section>
  );
}
