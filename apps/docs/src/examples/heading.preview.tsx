import { Heading, Stack, Text } from "@flux-ui/react";

export default function Preview() {
  return (
    <Stack gap={3}>
      <Heading level={2} size="xl">
        A title with a deliberate level.
      </Heading>
      <Text as="p">This remains an h2 even at a large display size.</Text>
    </Stack>
  );
}
