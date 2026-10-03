import { useState } from "react";
import {
  Card,
  Chart,
  ChartLegend,
  ChartTooltip,
  Field,
  Heading,
  Select,
  Stack,
  Text,
} from "@flux-ui/react";

const series = [
  {
    id: "in",
    label: "Illustrative inflow",
    data: [12, 18, 14, 26, null, 22, 30].map((y, x) => ({ x, y })),
  },
  {
    id: "out",
    label: "Illustrative outflow",
    tone: "warning" as const,
    data: [8, 11, 7, 12, 10, 17, 15].map((y, x) => ({ x, y })),
  },
];

export default function Preview() {
  const [type, setType] = useState<"line" | "area" | "bar">("line");

  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Chart type</Field.Label>
        <Field.Control>
          <Select
            value={type}
            onChange={(event) => {
              const next = event.currentTarget.value;
              if (next === "line" || next === "area" || next === "bar")
                setType(next);
            }}
          >
            <option value="line">Line</option>
            <option value="area">Area</option>
            <option value="bar">Bar</option>
          </Select>
        </Field.Control>
      </Field.Root>

      <Card as="section" padding={5}>
        <Stack gap="md">
          <Stack gap="xs">
            <Heading level={2} size="md">
              Cash flow
            </Heading>
            <Text variant="caption" tone="muted">
              Illustrative data · title and surface are ordinary composition.
            </Text>
          </Stack>

          <ChartLegend items={series} toggleVisibility>
            <ChartTooltip>
              <Chart
                label="Cash flow · illustrative data"
                description="Two fictional cash-flow series."
                series={series}
                type={type}
                formatX={(x) => `Day ${x + 1}`}
                formatY={(y) => `$${y}k`}
              />
            </ChartTooltip>
          </ChartLegend>
        </Stack>
      </Card>
    </Stack>
  );
}
