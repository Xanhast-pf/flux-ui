import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button.js";
import { ButtonGroup } from "./ButtonGroup.js";

const meta = {
  title: "Actions/ButtonGroup",
  component: ButtonGroup,
  args: {
    "aria-label": "Document actions",
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Save</Button>
      <Button variant="outline">Export</Button>
      <Button variant="outline">Share</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical", "aria-label": "View actions" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">List</Button>
      <Button variant="outline">Grid</Button>
    </ButtonGroup>
  ),
};
