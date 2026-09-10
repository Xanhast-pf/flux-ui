import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./Toggle.js";
const meta = {
  title: "Actions/Toggle",
  component: Toggle,
  args: { defaultPressed: false, children: "Pin example" },
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { defaultPressed: false, children: "Pin example" },
};
export const Pressed: Story = { args: { defaultPressed: true } };
export const Disabled: Story = { args: { disabled: true } };
