import { Box, PieChart } from "@varua/flux-ui";
import type { ScenarioProps } from "../scenario.types.js";

export default function Fixture({ count, revision }: ScenarioProps) {
  const data = Array.from({ length: count }, (_, index) => ({
    id: `slice-${index}`,
    label: `Slice ${index + 1}`,
    value: ((index * 17 + revision) % 97) + 1,
  }));

  return (
    <Box data-perf-root>
      <PieChart label="Seeded pie workload" data={data} maxSlices={256} />
    </Box>
  );
}
