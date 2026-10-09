import { Box, Text } from "@varua/flux-ui";
import type { ScenarioProps } from "../scenario.types.js";

export default function Fixture({ count, revision }: ScenarioProps) {
  return (
    <Box data-perf-root>
      {Array.from({ length: count }, (_, i) => `text-${i}`).map((id) => (
        <Text key={id}>
          {id} {revision}
        </Text>
      ))}
    </Box>
  );
}
