import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar.js";
const meta = {
  title: "Data display/Avatar",
  component: Avatar,
  args: { alt: "Demo team", fallback: "FL" },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { alt: "Demo team", fallback: "FL" } };
export const Large: Story = { args: { alt: "Demo team", size: "lg" } };
export const Decorative: Story = { args: { alt: "" } };
