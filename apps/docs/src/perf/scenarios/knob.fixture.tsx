import { Box, Knob } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";

const ignoreChange = () => {};

export default function Fixture({ count, revision }: ScenarioProps) {
  return (
    <Box data-perf-root>
      {Array.from({ length: count }, (_, i) => `knob-${i}`).map((id) => (
        <Knob
          key={id}
          aria-label={id}
          value={25 + revision * 50}
          onValueChange={ignoreChange}
        />
      ))}
    </Box>
  );
}
