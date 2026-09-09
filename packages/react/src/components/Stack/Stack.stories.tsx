import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "./Stack.js";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  args: { gap: "md" },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <div>Header</div>
      <div>Content</div>
      <div>Footer</div>
    </Stack>
  ),
};
