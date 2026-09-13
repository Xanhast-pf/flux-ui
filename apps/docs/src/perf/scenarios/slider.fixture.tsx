import { Box, Slider } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";

export default function Fixture({ count, revision }: ScenarioProps) {
  return (
    <Box data-perf-root>
      {Array.from({ length: count }, (_, i) => `slider-${i}`).map((id) => (
        <Slider
          key={id}
          aria-label={id}
          value={revision === 0 ? 25 : 75}
          readOnly
        />
      ))}
    </Box>
  );
}
