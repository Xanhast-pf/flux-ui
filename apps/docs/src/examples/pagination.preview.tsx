import { Pagination, Stack } from "@flux-ui/react";
import { useState } from "react";
const pages = [1, 2, 3, 4, 5] as const;
export default function Example() {
  const [page, setPage] = useState(1);
  return (
    <Stack gap="md">
      <p role="status">Example page {page} of 5.</p>
      <Pagination.Root
        page={page}
        pageCount={5}
        onPageChange={setPage}
        aria-label="Example pagination"
      >
        <Pagination.Previous />
        {pages.map((number) => (
          <Pagination.Page key={number} page={number} />
        ))}
        <Pagination.Next />
      </Pagination.Root>
    </Stack>
  );
}
