import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "./Sparkline.js";

const meta = {
  title: "Data/Sparkline",
  component: Sparkline,
  args: { label: "Activity: 3, 7, 5, 9", values: [3, 7, 5, 9] },
} satisfies Meta<typeof Sparkline>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
