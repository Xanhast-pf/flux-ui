import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge.js";
const meta = { title: "Display/Badge", component: Badge } satisfies Meta<
  typeof Badge
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: () => <Badge tone="success">Ready to ship</Badge>,
};
