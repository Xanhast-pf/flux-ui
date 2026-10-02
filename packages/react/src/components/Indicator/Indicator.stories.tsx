import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button.js";
import { Indicator } from "./Indicator.js";

const meta = {
  title: "Feedback/Indicator",
  component: Indicator,
} satisfies Meta<typeof Indicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = {
  args: {
    content: 4,
    children: (
      <Button aria-label="Inbox, 4 unread messages" variant="outline">
        Inbox
      </Button>
    ),
  },
};

export const Dot: Story = {
  args: {
    tone: "success",
    children: <Button variant="outline">Online</Button>,
  },
};
