import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "./ScrollArea.js";
const meta = {
  title: "Layout/ScrollArea",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    "aria-label": "Scrollable content",
    axis: "horizontal",
    children: "Scrollbars appear when content exceeds its available size.",
  },
};
