import { Chart, Box } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";

export default function Fixture({ count, revision }: ScenarioProps) {
  const series = [
    {
      id: "signal",
      label: "Seeded signal",
      data: Array.from({ length: count }, (_, x) => ({
        x,
        y: Math.sin(x / 20) + revision,
      })),
    },
  ];
  return (
    <Box data-perf-root>
      <Chart label="Signal workload" series={series} maxPoints={512} />
    </Box>
  );
}
