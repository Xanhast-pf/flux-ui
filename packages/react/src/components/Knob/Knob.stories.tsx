import type { Meta, StoryObj } from "@storybook/react-vite";
import { Knob } from "./Knob.js";
const meta = {
  title: "Audio/Knob",
  component: Knob,
  args: {
    "aria-label": "Filter cutoff",
    min: 20,
    max: 20000,
    step: 10,
    defaultValue: 1000,
    scale: "log",
  },
} satisfies Meta<typeof Knob>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const CustomDiameter: Story = {
  args: {
    style: {
      "--flux-knob-size": "6rem",
    },
  },
};
export const ResetShortcut: Story = {
  args: {
    defaultValue: 2000,
    resetValue: 1000,
  },
};
