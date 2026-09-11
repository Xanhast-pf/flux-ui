import { Box, Inline, Skeleton, Spinner, Stack, Text } from "@flux-ui/react";
export function ExampleLoading() {
  return (
    <Stack gap="lg">
      <Inline gap="sm">
        <Spinner label={null} />
        <Text role="status" as="p" variant="body">
          Loading component example…
        </Text>
      </Inline>
      <Box aria-busy="true">
        <Stack gap="md">
          <Skeleton style={{ width: "45%" }} />
          <Skeleton shape="block" style={{ height: "12rem" }} />
          <Skeleton style={{ width: "70%" }} />
        </Stack>
      </Box>
    </Stack>
  );
}
