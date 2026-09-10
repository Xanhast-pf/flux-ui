import type { Meta, StoryObj } from "@storybook/react-vite";
import { Callout } from "./Callout.js";
const meta = { title: "Feedback/Callout", component: Callout } satisfies Meta<
  typeof Callout
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: () => (
    <Callout tone="info">
      This is a local demo. Nothing is sent to a server.
    </Callout>
  ),
};
