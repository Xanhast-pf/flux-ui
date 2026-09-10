import { Tabs } from "@flux-ui/react";

export default function Example() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Example project sections" activateOnFocus>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
      <Tabs.Panel value="activity">Activity panel</Tabs.Panel>
      <Tabs.Panel value="settings">Settings panel</Tabs.Panel>
    </Tabs.Root>
  );
}
