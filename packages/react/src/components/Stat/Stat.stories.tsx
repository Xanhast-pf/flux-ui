import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stat } from "./Stat.js";
const meta = { title: "Display/Stat", component: Stat } satisfies Meta<
  typeof Stat
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    label: "Published components",
    value: 42,
    note: "Illustrative sample",
  },
};
