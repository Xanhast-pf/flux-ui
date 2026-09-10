import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./Slider.js";
const meta = { title: "Inputs/Slider", component: Slider } satisfies Meta<
  typeof Slider
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: () => (
    <Slider aria-label="Traffic" min={0} max={100} step={5} defaultValue={25} />
  ),
};
export const Disabled: Story = {
  args: {},
  render: () => (
    <Slider
      disabled
      aria-label="Traffic"
      min={0}
      max={100}
      step={5}
      defaultValue={25}
    />
  ),
};
