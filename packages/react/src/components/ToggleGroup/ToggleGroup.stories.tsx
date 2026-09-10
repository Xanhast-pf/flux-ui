import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroup } from "./ToggleGroup.js";
const meta = {
  title: "Actions/ToggleGroup",
  component: ToggleGroup.Root,
  args: { type: "single", defaultValue: "grid", "aria-label": "View layout" },
} satisfies Meta<typeof ToggleGroup.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { type: "single", defaultValue: "grid", "aria-label": "View layout" },
  render: (args) => (
    <ToggleGroup.Root {...args}>
      <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
      <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      <ToggleGroup.Item value="compact" disabled>
        Compact
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};
export const Vertical: Story = {
  args: {
    type: "single",
    defaultValue: "grid",
    "aria-label": "View layout",
    orientation: "vertical",
  },
  render: (args) => (
    <ToggleGroup.Root {...args}>
      <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
      <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      <ToggleGroup.Item value="compact" disabled>
        Compact
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};
export const Disabled: Story = {
  args: {
    type: "single",
    defaultValue: "grid",
    "aria-label": "View layout",
    disabled: true,
  },
  render: (args) => (
    <ToggleGroup.Root {...args}>
      <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
      <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      <ToggleGroup.Item value="compact" disabled>
        Compact
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};
