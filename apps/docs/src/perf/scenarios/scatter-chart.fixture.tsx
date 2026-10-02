import { Box, ScatterChart } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";

export default function Fixture({ count, revision }: ScenarioProps) {
  const series = [
    {
      id: "signal",
      label: "Seeded signal",
      data: Array.from({ length: count }, (_, index) => ({
        x: index,
        y: Math.sin(index / 20) * 50 + ((index * 37 + revision) % 19),
      })),
    },
  ];

  return (
    <Box data-perf-root>
      <ScatterChart
        label="Seeded scatter workload"
        series={series}
        maxPoints={512}
      />
    </Box>
  );
}
