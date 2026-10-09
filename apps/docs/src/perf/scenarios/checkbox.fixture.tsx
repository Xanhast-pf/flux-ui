import { Box, Checkbox } from "@varua/flux-ui";
import type { ScenarioProps } from "../scenario.types.js";
const ignoreChange = () => undefined;

export default function Fixture({ count, revision }: ScenarioProps) {
  return (
    <Box data-perf-root>
      {Array.from({ length: count }, (_, i) => `check-${i}`).map((id) => (
        <Checkbox
          key={id}
          aria-label={id}
          checked={revision !== 0}
          onChange={ignoreChange}
        />
      ))}
    </Box>
  );
}
