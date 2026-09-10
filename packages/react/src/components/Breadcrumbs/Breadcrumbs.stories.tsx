import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "./Breadcrumbs.js";
const meta = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs.Root,
  args: { "aria-label": "Example breadcrumb" },
} satisfies Meta<typeof Breadcrumbs.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { "aria-label": "Example breadcrumb" },
  render: (args) => (
    <Breadcrumbs.Root {...args}>
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#home">Home</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Current>Components</Breadcrumbs.Current>
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  ),
};
