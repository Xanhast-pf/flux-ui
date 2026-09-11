import {
  Box,
  Card,
  Grid,
  Heading,
  Link,
  Stack,
  Tabs,
  Text,
} from "@flux-ui/react";
import { useState } from "react";
import { ButtonLab } from "../demos/ButtonLab.js";
import { CollectionLab } from "../demos/CollectionLab.js";
import { ReleaseRoom } from "../demos/ReleaseRoom.js";
import { AppearanceControls } from "../ui/AppearanceControls.js";
export default function ComponentWorkbench() {
  const [mode, setMode] = useState("workspace");
  return (
    <Stack gap="lg">
      <Box>
        <Text as="p" variant="eyebrow" tone="muted">
          Component workbench
        </Text>
        <Heading level={2} size="lg">
          Inside the components.
        </Heading>
        <Text as="p" variant="lead" tone="muted">
          Real components. Local state. Zero consequences.
        </Text>
        <Text as="p" variant="caption" tone="muted">
          Switching labs starts a fresh demo. Theme and accent preferences stay
          with you.
        </Text>
      </Box>
      <Tabs.Root value={mode} onValueChange={setMode}>
        <Tabs.List aria-label="Playground modes" activateOnFocus>
          <Tabs.Tab value="workspace">Release room</Tabs.Tab>
          <Tabs.Tab value="button">Button lab</Tabs.Tab>
          <Tabs.Tab value="theme">Theme lab</Tabs.Tab>
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
        <Tabs.Panel value="theme">
          {mode === "theme" ? (
            <Grid columns={{ base: 1, lg: 2 }} gap="lg">
              <Card>
                <Stack gap="lg">
                  <Heading level={2} size="lg">
                    Set the mood.
                  </Heading>
                  <AppearanceControls />
                  <Link href="#tokens">Inspect every token →</Link>
                </Stack>
              </Card>
              <ReleaseRoom />
            </Grid>
          ) : null}
        </Tabs.Panel>
      </Tabs.Root>
    </Stack>
  );
}
