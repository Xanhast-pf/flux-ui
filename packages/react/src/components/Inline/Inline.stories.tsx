import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button.js";
import { Inline } from "./Inline.js";

const meta = {
  title: "Layout/Inline",
  component: Inline,
  args: { gap: "sm", align: "center" },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toolbar: Story = {
  render: (args) => (
    <Inline {...args} justify="between" wrap>
      <strong>Customers</strong>
      <Inline gap="sm">
        <Button variant="outline">Export</Button>
        <Button>Create customer</Button>
      </Inline>
    </Inline>
  ),
};
