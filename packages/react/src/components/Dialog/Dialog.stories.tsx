import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./Dialog.js";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog.Root,
} satisfies Meta<typeof Dialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Title>Project settings</Dialog.Title>
        <Dialog.Description>
          Review the project-level preferences before saving.
        </Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Root>
  ),
};
