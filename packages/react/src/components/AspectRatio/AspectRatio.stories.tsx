import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "./AspectRatio.js";
const meta = {
  title: "Layout/AspectRatio",
  component: AspectRatio,
  args: {
    ratio: 16 / 9,
    children: "A responsive media frame",
    style: { background: "var(--flux-color-accent-soft)", padding: "1rem" },
  },
} satisfies Meta<typeof AspectRatio>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    ratio: 16 / 9,
    children: "A responsive media frame",
    style: { background: "var(--flux-color-accent-soft)", padding: "1rem" },
  },
};
export const Square: Story = { args: { ratio: 1 } };
