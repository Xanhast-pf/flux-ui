import { Stack, Text } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";

export default function Fixture({ count, revision }: ScenarioProps) {
  return (
    <Stack data-perf-root gap={revision === 0 ? "sm" : "md"}>
      {Array.from({ length: count }, (_, i) => `cell-${i}`).map((id) => (
        <Text key={id}>{id}</Text>
      ))}
    </Stack>
  );
}
