import { Inline, Spinner, Stack } from "@flux-ui/react";
export default function Example() {
  return (
    <Stack gap="md">
      <Inline gap="md">
        <Spinner label="Loading preview" />
        <span>Preparing your preview</span>
      </Inline>
      <Inline gap="md">
        <Spinner size="sm" label={null} />
        <Spinner size="lg" label={null} />
        <span>Decorative sizes share the status above.</span>
      </Inline>
    </Stack>
  );
}
