import { Tabs } from "@flux-ui/react";
const sections = [
  ["overview", "Overview"],
  ["activity", "Activity"],
  ["settings", "Settings"],
  ["members", "Members"],
  ["billing", "Billing"],
  ["integrations", "Integrations"],
  ["notifications", "Notifications"],
  ["security", "Security"],
  ["history", "History"],
] as const;
export default function Example() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Example project sections" activateOnFocus>
        {sections.map(([value, label]) => (
          <Tabs.Tab key={value} value={value}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {sections.map(([value, label]) => (
        <Tabs.Panel key={value} value={value}>
          {label} panel
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
