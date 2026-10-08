import { Stack, Tabs, Text } from "@flux-ui/react";
import { useState } from "react";
import { ButtonLab } from "../demos/ButtonLab.js";
import { CollectionLab } from "../demos/CollectionLab.js";
import { ReleaseRoom } from "../demos/ReleaseRoom.js";
export default function ComponentWorkbench() {
  const [mode, setMode] = useState("workspace");
  return (
    <Stack gap="lg">
      <Text as="p" variant="caption" tone="muted">
        Switching labs resets the example.
      </Text>
      <Tabs.Root value={mode} onValueChange={setMode}>
        <Tabs.List aria-label="Playground modes" activateOnFocus wrap>
          <Tabs.Tab value="workspace">Release room</Tabs.Tab>
          <Tabs.Tab value="button">Button lab</Tabs.Tab>
          <Tabs.Tab value="collection">Collection lab</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="workspace">
          {mode === "workspace" ? <ReleaseRoom /> : null}
        </Tabs.Panel>
        <Tabs.Panel value="button">
          {mode === "button" ? <ButtonLab /> : null}
        </Tabs.Panel>
        <Tabs.Panel value="collection">
          {mode === "collection" ? <CollectionLab /> : null}
        </Tabs.Panel>
      </Tabs.Root>
    </Stack>
  );
}
