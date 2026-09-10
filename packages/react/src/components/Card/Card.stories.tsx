import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card.js";
const meta = { title: "Layout/Card", component: Card } satisfies Meta<
  typeof Card
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: () => (
    <Card>
      <h3>Ship something good.</h3>
      <p>Your next idea starts here.</p>
    </Card>
  ),
};
