import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer } from "./Drawer.js";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer.Root,
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>Open drawer</Drawer.Trigger>
      <Drawer.Popup side="right">
        <Drawer.Title>Project navigation</Drawer.Title>
        <Drawer.Description>
          Use a Drawer for compact navigation or secondary workflows.
        </Drawer.Description>
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};

export const Left: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>Open left drawer</Drawer.Trigger>
      <Drawer.Popup side="left">
        <Drawer.Title>Navigation</Drawer.Title>
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  ),
};
