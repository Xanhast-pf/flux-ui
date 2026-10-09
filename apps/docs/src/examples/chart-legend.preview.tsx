import { useState } from "react";
import { Chart, ChartLegend, ChartTooltip, Stack, Text } from "@varua/flux-ui";

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
  const [hiddenIds, setHiddenIds] = useState<readonly string[]>([]);

  return (
    <Stack gap="sm">
      <Text variant="caption" tone="muted">
        Controlled visibility composes with the same shared chart tooltip.
      </Text>
      <ChartLegend
        items={series}
        hiddenIds={hiddenIds}
        onHiddenIdsChange={setHiddenIds}
        placement="end"
        toggleVisibility
      >
        <ChartTooltip>
          <Chart
            label="Finance"
            series={series}
            formatX={(x) => `Quarter ${x + 1}`}
            formatY={(y) => `$${y}k`}
          />
        </ChartTooltip>
      </ChartLegend>
      <Text variant="caption" tone="muted">
        Visible:{" "}
        {series
          .filter((item) => !hiddenIds.includes(item.id))
          .map((item) => item.label)
          .join(", ") || "None"}
      </Text>
    </Stack>
  );
}
