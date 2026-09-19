import { Box, SplitPane, Text } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";

const ignoreValueChange = () => {};

export default function Fixture({ count, revision }: ScenarioProps) {
  return (
    <Box data-perf-root>
      {Array.from({ length: count }, (_, i) => `pane-${i}`).map((id) => (
        <SplitPane
          key={id}
          label={id}
          value={revision === 0 ? 40 : 60}
          onValueChange={ignoreValueChange}
          first={<Text>First</Text>}
          second={<Text>Second</Text>}
        />
      ))}
    </Box>
  );
}
