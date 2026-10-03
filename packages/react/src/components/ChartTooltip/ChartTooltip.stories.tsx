import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chart } from "../Chart/Chart.js";
import { ChartTooltip } from "./ChartTooltip.js";

const series = [
  {
    id: "revenue",
    label: "Revenue",
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 14 },
      { x: 2, y: 12 },
    ],
  },
];

const meta = {
  title: "Data/ChartTooltip",
  component: ChartTooltip,
  args: {
    children: <span>Chart</span>,
  },
} satisfies Meta<typeof ChartTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hover: Story = {
  render: () => (
    <ChartTooltip>
      <Chart label="Finance" series={series} />
    </ChartTooltip>
  ),
};

export const Click: Story = {
  render: () => (
    <ChartTooltip trigger="click">
      <Chart label="Finance" series={series} />
    </ChartTooltip>
  ),
};
