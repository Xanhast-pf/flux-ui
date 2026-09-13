import { Sidebar, Stack, Text } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";

export default function Fixture({ count, revision }: ScenarioProps) {
  return (
    <Sidebar.Root open={revision === 0}>
      <Sidebar.Layout data-perf-root>
        <Sidebar.Panel aria-label="Benchmark navigation">
          <Stack>
            {Array.from({ length: count }, (_, i) => `item-${i}`).map((id) => (
              <Text key={id}>{id}</Text>
            ))}
          </Stack>
        </Sidebar.Panel>
        <Sidebar.Content>Workspace</Sidebar.Content>
      </Sidebar.Layout>
    </Sidebar.Root>
  );
}
