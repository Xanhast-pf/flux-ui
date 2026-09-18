import { useState } from "react";
import { Button, Stack, Tabs } from "@flux-ui/react";
const labels = [
  "Overview",
  "Activity",
  "Settings",
  "Members",
  "Billing",
  "History",
];
export function ConsumerTabs() {
  const [wide, setWide] = useState(false);
  const [value, setValue] = useState("Overview");
  const [extra, setExtra] = useState(false);
  const [wrap, setWrap] = useState(false);
  const [vertical, setVertical] = useState(false);
  const items = extra ? [...labels, "Extra section"] : labels;
  return (
    <Stack as="section" aria-label="Built Tabs" gap="md">
      <Button onClick={() => setWide((previous) => !previous)}>
        Resize built Tabs
      </Button>
      <Button onClick={() => setExtra((previous) => !previous)}>
        Change Tabs membership
      </Button>
      <Button onClick={() => setWrap((value) => !value)}>
        Toggle wrapped Tabs
      </Button>
      <Button onClick={() => setVertical((value) => !value)}>
        Toggle vertical Tabs
      </Button>
      <Tabs.Root
        orientation={vertical ? "vertical" : "horizontal"}
        value={value}
        onValueChange={setValue}
        style={{ inlineSize: wide ? "64rem" : "20rem", maxInlineSize: "100%" }}
        data-testid="built-tabs"
      >
        <Tabs.List aria-label="Built tabs sections" wrap={wrap}>
          {items.map((item) => (
            <Tabs.Trigger key={item} value={item} disabled={item === "Billing"}>
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
      <Button>After built Tabs</Button>
    </Stack>
  );
}
