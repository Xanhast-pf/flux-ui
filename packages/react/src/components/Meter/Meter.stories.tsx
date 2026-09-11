import type { Meta, StoryObj } from "@storybook/react-vite";
import { Meter } from "./Meter.js";
const meta = { title: "Feedback/Meter", component: Meter } satisfies Meta<
  typeof Meter
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { "aria-label": "Measured budget usage", value: 62, min: 0, max: 100 },
};
