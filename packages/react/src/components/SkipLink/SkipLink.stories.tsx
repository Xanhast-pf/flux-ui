import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkipLink } from "./SkipLink.js";
const meta = {
  title: "Navigation/SkipLink",
  component: SkipLink,
} satisfies Meta<typeof SkipLink>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    href: "#skip-link-story-target",
    children: "Skip to example content",
  },
};
