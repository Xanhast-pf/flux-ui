import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./DatePicker.js";

const meta = {
  title: "Forms/DatePicker",
  component: DatePicker,
  args: {
    "aria-label": "DatePicker",
    defaultValue: "2026-10-01",
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
