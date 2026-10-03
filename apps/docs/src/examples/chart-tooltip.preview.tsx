import { useState } from "react";
import {
  Chart,
  ChartLegend,
  ChartTooltip,
  Field,
  Select,
  Stack,
  Text,
} from "@flux-ui/react";

const series = [
  {
    id: "revenue",
    label: "Revenue",
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 14 },
      { x: 2, y: 12 },
    ],
  },
  {
    id: "cost",
    label: "Cost",
    tone: "warning" as const,
    data: [
      { x: 0, y: 7 },
      { x: 1, y: 9 },
      { x: 2, y: 8 },
    ],
  },
];

export default function Preview() {
  const [trigger, setTrigger] = useState<"hover" | "click">("hover");

  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Tooltip trigger</Field.Label>
        <Field.Control>
          <Select
            value={trigger}
            onChange={(event) => {
              setTrigger(
                event.currentTarget.value === "click" ? "click" : "hover",
              );
            }}
          >
            <option value="hover">Hover</option>
            <option value="click">Click</option>
          </Select>
        </Field.Control>
      </Field.Root>
      <Text variant="caption" tone="muted">
        The legend, chart formatter and custom tooltip renderer stay
        independent.
      </Text>
      <ChartLegend items={series} placement="top">
        <ChartTooltip
          trigger={trigger}
          renderContent={(data) => (
            <Stack gap="xs">
              <Text variant="caption" tone="muted">
                {data.label ?? "Selected point"}
              </Text>
              <Text>
                {data.items
                  .map((item) => `${item.label}: ${item.value}`)
                  .join(" · ")}
              </Text>
            </Stack>
          )}
        >
          <Chart
            label="Finance"
            series={series}
            formatX={(x) => `Quarter ${x + 1}`}
            formatY={(y) => `$${y}k`}
          />
        </ChartTooltip>
      </ChartLegend>
    </Stack>
  );
}
