import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "./StatusBadge.js";
const meta = {
  title: "Display/StatusBadge",
  component: StatusBadge,
} satisfies Meta<typeof StatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: () => <StatusBadge tone="success">Ready to ship</StatusBadge>,
};
