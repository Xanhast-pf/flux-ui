import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeScope } from "./ThemeScope.js";
const meta = {
  title: "Layout/ThemeScope",
  component: ThemeScope,
} satisfies Meta<typeof ThemeScope>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    theme: "dark",
    query: true,
    padding: 6,
    surface: "canvas",
    children: "A local dark theme",
  },
};
