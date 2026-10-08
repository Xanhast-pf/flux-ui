import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "./ColorPicker.js";

const meta = {
  title: "Inputs/ColorPicker",
  component: ColorPicker,
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Brand color",
    defaultValue: "#6366f1",
  },
};
