import { Heading, Stack, Text } from "@flux-ui/react";

export default function HeadingSemantics() {
  return (
    <Stack gap={3}>
      <Heading level={2} size="xl">
        A title with a deliberate level.
      </Heading>
      <Text as="p">This remains an h2 even at a large display size.</Text>
    </Stack>
  );
}

export function HeadingSizeScale() {
  return (
    <Stack gap={3}>
      <Heading level={3} size="sm">
        Small heading
      </Heading>
      <Heading level={3} size="md">
        Medium heading
      </Heading>
      <Heading level={3} size="lg">
        Large heading
      </Heading>
      <Heading level={3} size="xl">
        Extra large heading
      </Heading>
      <Heading level={3} size="display">
        Display heading
      </Heading>
    </Stack>
  );
}
