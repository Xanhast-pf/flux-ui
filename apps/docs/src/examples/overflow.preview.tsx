import { useState } from "react";
import { Button, Overflow, Stack, Tabs, Text } from "@flux-ui/react";
const sections = [
  "Overview",
  "Activity",
  "Settings",
  "Members",
  "Billing",
  "Integrations",
  "Notifications",
  "Security",
  "History",
];
function ProjectTabs({ label }: { label: string }) {
  return (
    <Tabs.Root defaultValue="Overview">
      <Tabs.List aria-label={label}>
        {sections.map((value) => (
          <Tabs.Trigger
            key={value}
            value={value}
            disabled={value === "Billing"}
          >
            {value}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {sections.map((value) => (
        <Tabs.Content key={value} value={value}>
          {value} panel
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
export default function Preview() {
  const [narrow, setNarrow] = useState(true);
  return (
    <Stack gap="md">
      <Text>Plain Tabs uses native scrolling.</Text>
      <ProjectTabs label="Plain project sections" />
      <Text>
        Overflow keeps the selected tab visible and puts remaining tabs in More
        tabs.
      </Text>
      <Button onClick={() => setNarrow((value) => !value)}>
        Toggle available width
      </Button>
      <Overflow style={{ maxInlineSize: narrow ? "20rem" : "100%" }}>
        <ProjectTabs label="Overflow project sections" />
      </Overflow>
      <Text>
        Use arrows and Home/End in the tab list. Tab to More items, open its
        native picker and choose a section. Escape cancels the picker.
      </Text>
    </Stack>
  );
}
