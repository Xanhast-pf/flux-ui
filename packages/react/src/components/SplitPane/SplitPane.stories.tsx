import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitPane } from "./SplitPane.js";

const meta = {
  title: "Layout/SplitPane",
  component: SplitPane,
  args: {
    label: "Resize panes",
    first: <p>First pane</p>,
    second: <p>Second pane</p>,
    defaultValue: 40,
  },
} satisfies Meta<typeof SplitPane>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
