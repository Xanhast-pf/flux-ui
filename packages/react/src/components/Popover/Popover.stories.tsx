import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./Popover.js";
const meta = {
  title: "Overlays/Popover",
  render: () => (
    <>
      <Popover.Root>
        <Popover.Trigger>Workspace settings</Popover.Trigger>
        <Popover.Popup aria-label="Workspace settings">
          <Popover.Close>Done</Popover.Close>
        </Popover.Popup>
      </Popover.Root>
    </>
  ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
