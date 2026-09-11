import {
  Meter,
  PageHeader,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@flux-ui/react";
import { health } from "../generated/health.js";
import { budgetUsage, formatBytes } from "../lib/format.js";
import { BundleExplorer } from "../ui/BundleExplorer.js";
import { MeasurementNotice } from "../ui/MeasurementNotice.js";
export function SizePage() {
  const runtimeBrotli = health.size.aggregate.runtime.brotli;
  const publishedBrotli = health.size.aggregate.published.brotli;
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="md">
        <MeasurementNotice />
        <PageHeader title={<>Bundle-size health</>}>
          <Text as="p" variant="body">
            Every public component has an absolute complexity-class budget and a
            historical regression baseline. The meters below show Brotli size
            against each component&apos;s absolute budget.
          </Text>
        </PageHeader>

        <BundleExplorer />
        <ScrollArea aria-label="Measurement table" axis="horizontal">
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
                      {usage === null ? null : (
                        <Meter
                          min={0}
                          max={1}
                          value={usage}
                          aria-label={`${component.name} Brotli budget usage`}
                        />
                      )}{" "}
                      {usage === null
                        ? "Pending baseline"
                        : `${(usage * 100).toFixed(1)}%`}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </ScrollArea>

        <Text as="p" variant="body">
          Last measured aggregate runtime:{" "}
          <Text as="strong" weight="bold">
            {formatBytes(runtimeBrotli)}
          </Text>
          . Published package:{" "}
          <Text as="strong" weight="bold">
            {formatBytes(publishedBrotli)}
          </Text>
          .
        </Text>
      </Stack>
    </Stack>
  );
}
