import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimePicker } from "./TimePicker.js";

const meta = {
  title: "Forms/TimePicker",
  component: TimePicker,
  args: {
    "aria-label": "TimePicker",
    defaultValue: "14:30",
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
