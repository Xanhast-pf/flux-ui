import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fader } from "./Fader.js";

const meta = {
  title: "Audio/Fader",
  component: Fader,
  args: { "aria-label": "Gain", min: -60, max: 0, defaultValue: -12 },
} satisfies Meta<typeof Fader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
