import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chart } from "../Chart/Chart.js";
import { ChartLegend } from "./ChartLegend.js";

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
  {
    id: "cost",
    label: "Cost",
    tone: "warning" as const,
    data: [
      { x: 0, y: 7 },
      { x: 1, y: 9 },
      { x: 2, y: 8 },
    ],
  },
];

const meta = {
  title: "Data/ChartLegend",
  component: ChartLegend,
  args: {
    children: <span>Chart</span>,
    items: series,
  },
} satisfies Meta<typeof ChartLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ChartLegend items={series}>
      <Chart label="Finance" series={series} />
    </ChartLegend>
  ),
};

export const ToggleVisibility: Story = {
  render: () => (
    <ChartLegend items={series} placement="end" toggleVisibility>
      <Chart label="Finance" series={series} />
    </ChartLegend>
  ),
};
