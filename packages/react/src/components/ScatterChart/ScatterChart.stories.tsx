import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../Card/Card.js";
import { ChartLegend } from "../ChartLegend/ChartLegend.js";
import { ChartTooltip } from "../ChartTooltip/ChartTooltip.js";
import { Heading } from "../Heading/Heading.js";
import { Stack } from "../Stack/Stack.js";
import { ScatterChart } from "./ScatterChart.js";

const series = [
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
  {
    id: "worker",
    label: "Worker",
    tone: "success" as const,
    data: [
      { x: 10, y: 55 },
      { x: 28, y: 78 },
      { x: 52, y: 97 },
      { x: 100, y: 132 },
    ],
  },
];

const meta = {
  title: "Data display/ScatterChart",
  component: ScatterChart,
  args: {
    label: "Latency vs payload",
    series,
  },
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {};

export const Composed: Story = {
  render: (args) => (
    <Card as="section" padding={5}>
      <Stack gap="md">
        <Heading level={3} size="md">
          Latency vs payload
        </Heading>
        <ChartLegend items={series} placement="end">
          <ChartTooltip>
            <ScatterChart {...args} />
          </ChartTooltip>
        </ChartLegend>
      </Stack>
    </Card>
  ),
};
