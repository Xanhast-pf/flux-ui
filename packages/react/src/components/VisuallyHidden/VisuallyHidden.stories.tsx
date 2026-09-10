import type { Meta, StoryObj } from "@storybook/react-vite";
import { VisuallyHidden } from "./VisuallyHidden.js";
const meta = {
  title: "Accessibility/VisuallyHidden",
  component: VisuallyHidden,
  args: { children: "Screen-reader text" },
} satisfies Meta<typeof VisuallyHidden>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { children: "Screen-reader text" },
  render: (args) => (
    <p>
      Visually hidden content follows: <VisuallyHidden {...args} />
    </p>
  ),
};
