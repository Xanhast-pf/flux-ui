import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "../Tabs/Tabs.js";
import { Overflow } from "./Overflow.js";
const meta = { title: "Layout/Overflow", component: Overflow } satisfies Meta<
  typeof Overflow
>;
export default meta;
type Story = StoryObj<typeof meta>;
const sections = [
  "Overview",
  "Activity",
  "Settings",
  "Members",
  "Billing",
  "Integrations",
];
export const Default: Story = {
  args: {
    style: { width: "20rem", resize: "horizontal", overflow: "auto" },
    children: (
      <Tabs.Root defaultValue="Overview">
        <Tabs.List aria-label="Project sections">
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
    ),
  },
};
