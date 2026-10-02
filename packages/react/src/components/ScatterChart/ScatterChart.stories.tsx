import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScatterChart } from "./ScatterChart.js";

const meta = {
  title: "Data/ScatterChart",
  component: ScatterChart,
  args: {
    label: "Latency vs payload",
    series: [
      {
        id: "api",
        label: "API",
        data: [
          { x: 12, y: 82 },
          { x: 24, y: 105 },
          { x: 48, y: 141 },
          { x: 96, y: 218 },
        ],
      },
    ],
  },
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
