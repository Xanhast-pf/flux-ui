import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination.js";
const meta = {
  title: "Navigation/Pagination",
  component: Pagination.Root,
  args: {
    page: 1,
    pageCount: 3,
    onPageChange: () => {},
    "aria-label": "Results",
  },
} satisfies Meta<typeof Pagination.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    page: 1,
    pageCount: 3,
    onPageChange: () => {},
    "aria-label": "Results",
  },
  render: (args) => (
    <Pagination.Root {...args}>
      <Pagination.Previous />
      <Pagination.Page page={1} />
      <Pagination.Page page={2} />
      <Pagination.Page page={3} />
      <Pagination.Next />
    </Pagination.Root>
  ),
};
export const LastPage: Story = {
  args: {
    page: 3,
    pageCount: 3,
    onPageChange: () => {},
    "aria-label": "Results",
  },
  render: (args) => (
    <Pagination.Root {...args}>
      <Pagination.Previous />
      <Pagination.Page page={1} />
      <Pagination.Page page={2} />
      <Pagination.Page page={3} />
      <Pagination.Next />
    </Pagination.Root>
  ),
};
