import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs.js";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs.Root,
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "overview",
  },
  render: (args) => (
    <Tabs.Root {...args}>
      <Tabs.List aria-label="Workspace sections">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Workspace overview.</Tabs.Panel>
      <Tabs.Panel value="activity">Recent activity.</Tabs.Panel>
      <Tabs.Panel value="settings">Workspace settings.</Tabs.Panel>
    </Tabs.Root>
  ),
};

export const Vertical: Story = {
  args: {
    defaultValue: "overview",
    orientation: "vertical",
  },
  render: (args) => (
    <Tabs.Root {...args}>
      <Tabs.List aria-label="Workspace sections">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Workspace overview.</Tabs.Panel>
      <Tabs.Panel value="activity">Recent activity.</Tabs.Panel>
    </Tabs.Root>
  ),
};

export const Responsive: Story = {
  args: { defaultValue: "Overview" },
  render: (args) => (
    <Tabs.Root {...args} style={{ maxInlineSize: "20rem" }}>
      <Tabs.List aria-label="Responsive project sections">
        {[
          "Overview",
          "Activity",
          "Settings",
          "Members",
          "Billing",
          "History",
        ].map((value) => (
          <Tabs.Tab key={value} value={value} disabled={value === "Billing"}>
            {value}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {[
        "Overview",
        "Activity",
        "Settings",
        "Members",
        "Billing",
        "History",
      ].map((value) => (
        <Tabs.Panel key={value} value={value}>
          {value} panel
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  ),
};

export const Wrapping: Story = {
  args: { defaultValue: "Overview" },
  render: (args) => (
    <Tabs.Root {...args} style={{ maxInlineSize: "20rem" }}>
      <Tabs.List wrap aria-label="Wrapping project sections">
        {["Overview", "Activity", "Settings", "Members", "History"].map(
          (value) => (
            <Tabs.Tab key={value} value={value}>
              {value}
            </Tabs.Tab>
          ),
        )}
      </Tabs.List>
      {["Overview", "Activity", "Settings", "Members", "History"].map(
        (value) => (
          <Tabs.Panel key={value} value={value}>
            {value} panel
          </Tabs.Panel>
        ),
      )}
    </Tabs.Root>
  ),
};
