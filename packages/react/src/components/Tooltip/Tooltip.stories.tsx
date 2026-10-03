import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip.js";
const meta = {
  title: "Overlays/Tooltip",
  render: () => (
    <>
      <Tooltip content="Save changes to this local draft." arrow>
        <button type="button">Save draft</button>
      </Tooltip>
    </>
  ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const WithoutArrow: Story = {
  render: () => (
    <Tooltip content="Arrow rendering is opt-in.">
      <button type="button">Plain tooltip</button>
    </Tooltip>
  ),
};

export const InitiallyOpen: Story = {
  render: () => (
    <Tooltip content="Visible from initial owner state." defaultOpen arrow>
      <button type="button">Owner state</button>
    </Tooltip>
  ),
};
