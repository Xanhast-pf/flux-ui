import type { Meta, StoryObj } from "@storybook/react-vite";
import { PieChart } from "./PieChart.js";

const meta = {
  title: "Data/PieChart",
  component: PieChart,
  args: {
    label: "Revenue by product",
    data: [
      { id: "core", label: "Core", value: 52 },
      { id: "pro", label: "Pro", value: 31 },
      { id: "services", label: "Services", value: 17 },
    ],
  },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
