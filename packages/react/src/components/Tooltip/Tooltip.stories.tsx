import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip.js";
const meta = {
  title: "Overlays/Tooltip",
  render: () => (
    <>
      <Tooltip content="Save changes to this local draft.">
        <button type="button">Save draft</button>
      </Tooltip>
    </>
  ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
