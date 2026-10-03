import {
  Card,
  ChartLegend,
  ChartTooltip,
  Heading,
  PieChart,
  Stack,
  Text,
} from "@flux-ui/react";

const data = [
  { id: "core", label: "Core", value: 52 },
  { id: "pro", label: "Pro", value: 31, tone: "info" as const },
  { id: "services", label: "Services", value: 17, tone: "success" as const },
];

export default function Example() {
  return (
    <Card as="section" padding={5}>
      <Stack gap="md">
        <Stack gap="xs">
          <Heading level={2} size="md">
            Revenue by product
          </Heading>
          <Text variant="caption" tone="muted">
            Toggle categories, then click a slice to keep its recalculated value
            visible.
          </Text>
        </Stack>
        <ChartLegend items={data} toggleVisibility>
          <ChartTooltip trigger="click">
            <PieChart
              label="Revenue by product"
              description="Illustrative product mix."
              data={data}
              formatValue={(value) => `$${value}k`}
            />
          </ChartTooltip>
        </ChartLegend>
      </Stack>
    </Card>
  );
}
