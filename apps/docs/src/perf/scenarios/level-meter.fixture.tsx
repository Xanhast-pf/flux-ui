import { Box, LevelMeter } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";

export default function Fixture({ count, revision }: ScenarioProps) {
  return (
    <Box data-perf-root>
      {Array.from({ length: count }, (_, i) => `meter-${i}`).map((id) => (
        <LevelMeter
          key={id}
          aria-label={id}
          value={-24 + revision * 12}
          peak={-6}
        />
      ))}
    </Box>
  );
}
