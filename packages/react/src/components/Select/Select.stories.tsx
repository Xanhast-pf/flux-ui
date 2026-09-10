import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select.js";
const meta = { title: "Inputs/Select", component: Select } satisfies Meta<
  typeof Select
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: () => (
    <Select aria-label="Environment" defaultValue="preview">
      <option value="preview">Preview</option>
      <option value="production">Production</option>
    </Select>
  ),
};
export const Disabled: Story = {
  args: {},
  render: () => (
    <Select disabled aria-label="Environment" defaultValue="preview">
      <option value="preview">Preview</option>
      <option value="production">Production</option>
    </Select>
  ),
};
