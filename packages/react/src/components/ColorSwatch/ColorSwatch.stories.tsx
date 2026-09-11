import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSwatch } from "./ColorSwatch.js";
const meta = {
  title: "Display/ColorSwatch",
  component: ColorSwatch,
} satisfies Meta<typeof ColorSwatch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { color: "var(--flux-color-accent)", selected: true },
};
