import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chart } from "./Chart.js";

const meta = {
  title: "Data/Chart",
  component: Chart,
  args: {
    label: "Weekly activity",
    series: [
      {
        id: "one",
        label: "Visits",
        data: [
          { x: 0, y: 4 },
          { x: 1, y: 9 },
          { x: 2, y: null },
          { x: 3, y: 7 },
        ],
      },
    ],
  },
} satisfies Meta<typeof Chart>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
