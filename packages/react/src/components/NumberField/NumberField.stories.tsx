import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberField } from "./NumberField.js";

const meta = {
  title: "Forms/NumberField",
  component: NumberField,
  args: { "aria-label": "Tempo", min: 40, max: 240, defaultValue: 120 },
} satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
