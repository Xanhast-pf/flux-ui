import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "./IconButton.js";
const meta = {
  title: "Actions/IconButton",
  component: IconButton,
  args: {
    "aria-label": "Add a spark",
    children: <span aria-hidden="true">+</span>,
  },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    "aria-label": "Add a spark",
    children: <span aria-hidden="true">+</span>,
  },
};
export const Loading: Story = {
  args: {
    "aria-label": "Add a spark",
    children: <span aria-hidden="true">+</span>,
    loading: true,
  },
};
export const Disabled: Story = {
  args: {
    "aria-label": "Add a spark",
    children: <span aria-hidden="true">+</span>,
    disabled: true,
  },
};
