import { Stack, Tabs } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";
const sections = ["Overview", "Activity", "Members", "Settings", "History"];
export default function Fixture({ count, revision }: ScenarioProps) {
  return (
    <Stack data-perf-root>
      {Array.from({ length: count }, (_, index) => `collection-${index}`).map(
        (id) => (
          <Tabs.Root
            key={id}
            value={revision ? "History" : "Overview"}
            style={{ inlineSize: revision ? "16rem" : "24rem" }}
          >
            <Tabs.List aria-label={id}>
              {sections.map((value) => (
                <Tabs.Trigger key={value} value={value}>
                  {value}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {sections.map((value) => (
              <Tabs.Content key={value} value={value}>
                {value}
              </Tabs.Content>
            ))}
          </Tabs.Root>
        ),
      )}
    </Stack>
  );
}
