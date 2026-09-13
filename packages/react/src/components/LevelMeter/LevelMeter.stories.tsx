import type { Meta, StoryObj } from "@storybook/react-vite";
import { LevelMeter } from "./LevelMeter.js";

const meta = {
  title: "Audio/LevelMeter",
  component: LevelMeter,
  args: { "aria-label": "Output level", value: -18, peak: -3 },
} satisfies Meta<typeof LevelMeter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
