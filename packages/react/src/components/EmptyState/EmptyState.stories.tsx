import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState.js";
const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    title: "No matching projects",
    description: "Try a broader name or clear the current filter.",
    headingLevel: 3,
  },
};
