import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination.js";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination.Root,
  args: {
    page: 1,
    pageCount: 12,
    onPageChange: () => {},
    "aria-label": "Results",
  },
} satisfies Meta<typeof Pagination.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultPagination() {
  const [page, setPage] = useState(6);
  return (
    <Pagination.Root
      page={page}
      pageCount={12}
      onPageChange={setPage}
      aria-label="Results"
    >
      <Pagination.First />
      <Pagination.Previous />
      <Pagination.Range />
      <Pagination.Next />
      <Pagination.Last />
    </Pagination.Root>
  );
}

export const Default: Story = {
  render: () => <DefaultPagination />,
};

export const CompactRange: Story = {
  render: () => (
    <Pagination.Root
      page={18}
      pageCount={40}
      onPageChange={() => {}}
      aria-label="Results"
    >
      <Pagination.Previous />
      <Pagination.Range siblingCount={0} boundaryCount={1} />
      <Pagination.Next />
    </Pagination.Root>
  ),
};
