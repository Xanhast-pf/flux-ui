import { Inline, Skeleton, Spinner, Stack } from "@flux-ui/react";
export function ExampleLoading() {
  return (
    <Stack gap="lg">
      <Inline gap="sm">
        <Spinner label={null} />
        <p role="status">Loading component example…</p>
      </Inline>
      <div aria-busy="true">
        <Stack gap="md">
          <Skeleton style={{ width: "45%" }} />
          <Skeleton shape="block" style={{ height: "12rem" }} />
          <Skeleton style={{ width: "70%" }} />
        </Stack>
      </div>
    </Stack>
  );
}
