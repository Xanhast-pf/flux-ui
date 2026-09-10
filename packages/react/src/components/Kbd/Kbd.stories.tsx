import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./Kbd.js";
const meta = {
  title: "Typography/Kbd",
  component: Kbd,
  args: { children: "Ctrl K" },
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { children: "Ctrl K" } };
