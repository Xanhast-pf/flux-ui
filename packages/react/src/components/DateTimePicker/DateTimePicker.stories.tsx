import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimePicker } from "./DateTimePicker.js";

const meta = {
  title: "Forms/DateTimePicker",
  component: DateTimePicker,
  args: {
    "aria-label": "DateTimePicker",
    defaultValue: "2026-10-01T14:30",
  },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
