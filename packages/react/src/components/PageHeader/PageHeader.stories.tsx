import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "./PageHeader.js";
const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
} satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { level: 2, eyebrow: "Workspace", title: "Project settings" },
};
