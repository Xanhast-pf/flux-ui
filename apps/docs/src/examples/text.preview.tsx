import { Stack, Text } from "@flux-ui/react";

export default function Preview() {
  return (
    <Stack gap={3}>
      <Text as="p" variant="body">
        A clear body paragraph.
      </Text>
      <Text as="p" variant="caption" tone="muted">
        Supporting details stay in the same type system.
      </Text>
      <Text as="strong" variant="metric" numeric>
        12,480
      </Text>
      <Text as="time" dateTime="2026-09-11" variant="caption">
        September 11, 2026
      </Text>
    </Stack>
  );
}
