import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../Card/Card.js";
import { Heading } from "../Heading/Heading.js";
import { Stack } from "../Stack/Stack.js";
import { Text } from "../Text/Text.js";
import { Chart } from "./Chart.js";
import { ChartLegend } from "../ChartLegend/ChartLegend.js";
import { ChartTooltip } from "../ChartTooltip/ChartTooltip.js";

const series = [
  {
    id: "visits",
    label: "Visits",
    data: [
      { x: 0, y: 4 },
      { x: 1, y: 9 },
      { x: 2, y: 7 },
      { x: 3, y: 12 },
    ],
  },
  {
    id: "signups",
    label: "Signups",
    tone: "success" as const,
    data: [
      { x: 0, y: 2 },
      { x: 1, y: 5 },
      { x: 2, y: 4 },
      { x: 3, y: 8 },
    ],
  },
];

const meta = {
  title: "Data display/Chart",
  component: Chart,
  args: {
    label: "Weekly activity",
    series,
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {};

export const Composed: Story = {
  render: (args) => (
    <Card as="section" padding={5}>
      <Stack gap="md">
        <Stack gap="xs">
          <Heading level={3} size="md">
            Weekly activity
          </Heading>
          <Text variant="caption" tone="muted">
            Card, title, legend and tooltip are optional composition.
          </Text>
        </Stack>
        <ChartLegend items={series} toggleVisibility>
          <ChartTooltip>
            <Chart {...args} />
          </ChartTooltip>
        </ChartLegend>
      </Stack>
    </Card>
  ),
};
