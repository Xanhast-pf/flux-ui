import { Inline, Spinner, Stack, Text } from "@flux-ui/react";
export default function Example() {
  return (
    <Stack gap="md">
      <Inline gap="md">
        <Spinner label="Loading preview" />
        <Text>Preparing your preview</Text>
      </Inline>
      <Inline gap="md">
        <Spinner size="sm" label={null} />
        <Spinner size="lg" label={null} />
        <Text>Decorative sizes share the status above.</Text>
      </Inline>
    </Stack>
  );
}
