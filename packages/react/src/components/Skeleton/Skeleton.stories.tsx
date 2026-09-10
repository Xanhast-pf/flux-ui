import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton.js";
const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  args: { shape: "line" },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { shape: "line" } };
export const Circle: Story = { args: { shape: "circle" } };
export const Block: Story = { args: { shape: "block" } };
