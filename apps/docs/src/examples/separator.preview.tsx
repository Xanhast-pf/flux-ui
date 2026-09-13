import { Inline, Separator, Stack, Text } from "@flux-ui/react";

export default function Example() {
  return (
    <Stack gap="md">
      <Text as="p" variant="body">
        A semantic break between ideas.
      </Text>
      <Separator />
      <Inline gap="md">
        <Text>Compose</Text>
        <Separator decorative orientation="vertical" />
        <Text>Customize</Text>
        <Separator decorative orientation="vertical" />
        <Text>Ship</Text>
      </Inline>
    </Stack>
  );
}
