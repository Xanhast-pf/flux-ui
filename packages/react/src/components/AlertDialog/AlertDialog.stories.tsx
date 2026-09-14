import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog } from "./AlertDialog.js";
const meta = {
  title: "Overlays/AlertDialog",
  render: () => (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>Discard draft</AlertDialog.Trigger>
        <AlertDialog.Popup>
          <AlertDialog.Title>Discard this draft?</AlertDialog.Title>
          <AlertDialog.Description>
            This example does not delete remote data.
          </AlertDialog.Description>
          <AlertDialog.Close>Keep draft</AlertDialog.Close>
        </AlertDialog.Popup>
      </AlertDialog.Root>
    </>
  ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
