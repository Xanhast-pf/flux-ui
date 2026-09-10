import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./Progress.js";
const meta = { title: "Feedback/Progress", component: Progress } satisfies Meta<
  typeof Progress
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: () => <Progress aria-label="Release checklist" value={50} />,
};
export const Indeterminate: Story = {
  args: { "aria-label": "Loading preview" },
};
