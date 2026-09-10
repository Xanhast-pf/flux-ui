import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch.js";
const meta = { title: "Inputs/Switch", component: Switch } satisfies Meta<
  typeof Switch
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: () => <Switch aria-label="Release notifications" defaultChecked />,
};
export const Disabled: Story = {
  args: {},
  render: () => (
    <Switch disabled aria-label="Release notifications" defaultChecked />
  ),
};
