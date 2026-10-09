import {
  Card,
  ChartLegend,
  ChartTooltip,
  Heading,
  ScatterChart,
  Stack,
  Text,
} from "@varua/flux-ui";

const series = [
  {
    id: "api",
    label: "API",
    data: [
      { x: 12, y: 82 },
      { x: 24, y: 105 },
      { x: 48, y: 141 },
      { x: 96, y: 218 },
    ],
  },
  {
    id: "worker",
    label: "Worker",
    tone: "success" as const,
    data: [
      { x: 10, y: 55 },
      { x: 28, y: 78 },
      { x: 52, y: 97 },
      { x: 100, y: 132 },
    ],
  },
];

export default function Example() {
  return (
    <Card as="section" padding={5}>
      <Stack gap="md">
        <Stack gap="xs">
          <Heading level={2} size="md">
            Latency vs payload
          </Heading>
          <Text variant="caption" tone="muted">
            Toggle a series or hover the plot; shared formatters feed both the
            inspector and tooltip.
          </Text>
        </Stack>
        <ChartLegend items={series} placement="end" toggleVisibility>
          <ChartTooltip>
            <ScatterChart
              label="Latency vs payload"
              description="Illustrative source points."
              series={series}
              formatX={(value) => `${value} kB`}
              formatY={(value) => `${value} ms`}
            />
          </ChartTooltip>
        </ChartLegend>
      </Stack>
    </Card>
  );
}
