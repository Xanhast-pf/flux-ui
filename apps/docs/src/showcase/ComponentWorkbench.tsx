import { useState } from "react";
import { Card, Stack, Tabs } from "@flux-ui/react";
import { CollectionLab } from "../demos/CollectionLab.js";
import { ReleaseRoom } from "../demos/ReleaseRoom.js";
import { ButtonLab } from "../demos/ButtonLab.js";
import { AppearanceControls } from "../ui/AppearanceControls.js";
export default function ComponentWorkbench() {
  const [mode, setMode] = useState("workspace");
  return (
    <Stack gap="lg">
      <div>
        <p className="eyebrow">Component workbench</p>
        <h2>Inside the components.</h2>
        <p className="lede">Real components. Local state. Zero consequences.</p>
        <p className="demo-help">
          Switching labs starts a fresh demo. Theme and accent preferences stay
          with you.
        </p>
      </div>
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
            <div className="lab-grid">
              <Card>
                <Stack gap="lg">
                  <h2>Set the mood.</h2>
                  <AppearanceControls />
                  <a href="#tokens">Inspect every token →</a>
                </Stack>
              </Card>
              <ReleaseRoom />
            </div>
          ) : null}
        </Tabs.Panel>
      </Tabs.Root>
    </Stack>
  );
}
