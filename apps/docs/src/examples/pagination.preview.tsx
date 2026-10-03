import { Pagination, Stack, Text } from "@flux-ui/react";
import { useState } from "react";

export default function Example() {
  const [page, setPage] = useState(6);
  return (
    <Stack gap="md">
      <Text as="p" variant="body" role="status">
        Example page {page} of 12.
      </Text>
      <Pagination.Root
        page={page}
        pageCount={12}
        onPageChange={setPage}
        aria-label="Example pagination"
      >
        <Pagination.First />
        <Pagination.Previous />
        <Pagination.Range />
        <Pagination.Next />
        <Pagination.Last />
      </Pagination.Root>
    </Stack>
  );
}
