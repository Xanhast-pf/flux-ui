import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "./Tag.js";
const meta = {
  title: "Data display/Tag",
  render: () => (
    <>
      <Tag>Design</Tag>
    </>
  ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
