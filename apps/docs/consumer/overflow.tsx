import { useState } from "react";
import { Button, Overflow, Stack, Tabs } from "@flux-ui/react";
const labels = [
  "Overview",
  "Activity",
  "Settings",
  "Members",
  "Billing",
  "History",
];
export function ConsumerOverflow() {
  const [wide, setWide] = useState(false);
  const [value, setValue] = useState("Overview");
  const [extra, setExtra] = useState(false);
  const items = extra ? [...labels, "Extra section"] : labels;
  return (
    <Stack as="section" aria-label="Built Overflow" gap="md">
      <Button onClick={() => setWide((previous) => !previous)}>
        Resize built Overflow
      </Button>
      <Button onClick={() => setExtra((previous) => !previous)}>
        Change Overflow membership
      </Button>
      <Overflow
        style={{ inlineSize: wide ? "64rem" : "20rem", maxInlineSize: "100%" }}
        data-testid="built-overflow"
      >
        <Tabs.Root value={value} onValueChange={setValue}>
          <Tabs.List aria-label="Built overflow sections">
            {items.map((item) => (
              <Tabs.Trigger
                key={item}
                value={item}
                disabled={item === "Billing"}
              >
                {item}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {items.map((item) => (
            <Tabs.Content key={item} value={item}>
              {item} built panel
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Overflow>
      <Button>After built Overflow</Button>
    </Stack>
  );
}
