import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu } from "./DropdownMenu.js";
const meta = {
  title: "Overlays/DropdownMenu",
  render: () => (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Project actions</DropdownMenu.Trigger>
        <DropdownMenu.Popup aria-label="Project actions">
          <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Archive</DropdownMenu.Item>
        </DropdownMenu.Popup>
      </DropdownMenu.Root>
    </>
  ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
