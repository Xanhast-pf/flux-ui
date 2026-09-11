import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "./Box.js";
const meta = { title: "Layout/Box", component: Box } satisfies Meta<typeof Box>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    as: "section",
    "aria-label": "Project summary",
    padding: 6,
    surface: "subtle",
    border: "all",
    children: "Project summary",
  },
};
