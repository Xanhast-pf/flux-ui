import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../Card/Card.js";
import { ChartLegend } from "../ChartLegend/ChartLegend.js";
import { ChartTooltip } from "../ChartTooltip/ChartTooltip.js";
import { Heading } from "../Heading/Heading.js";
import { Stack } from "../Stack/Stack.js";
import { PieChart } from "./PieChart.js";

const data = [
  { id: "core", label: "Core", value: 52 },
  { id: "pro", label: "Pro", value: 31, tone: "info" as const },
  { id: "services", label: "Services", value: 17, tone: "success" as const },
];

const meta = {
  title: "Data display/PieChart",
  component: PieChart,
  args: {
    label: "Revenue by product",
    data,
  },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {};

export const Composed: Story = {
  render: (args) => (
    <Card as="section" padding={5}>
      <Stack gap="md">
        <Heading level={3} size="md">
          Revenue by product
        </Heading>
        <ChartLegend items={data}>
          <ChartTooltip trigger="click">
            <PieChart {...args} />
          </ChartTooltip>
        </ChartLegend>
      </Stack>
    </Card>
  ),
};
