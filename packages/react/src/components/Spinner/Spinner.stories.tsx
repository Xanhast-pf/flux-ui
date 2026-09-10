import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner.js";
const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  args: { label: "Loading preview" },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { label: "Loading preview" } };
export const Large: Story = { args: { size: "lg" } };
export const Decorative: Story = { args: { label: null } };
