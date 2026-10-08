import { Stack, Text } from "@flux-ui/react";

export default function TextRoles() {
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

export function TextToneAndEmphasis() {
  return (
    <Stack gap={3}>
      <Text tone="muted">Muted supporting text</Text>
      <Text tone="accent" weight="medium">
        Accent emphasis
      </Text>
      <Text tone="danger" weight="bold">
        Danger emphasis
      </Text>
      <Text italic>Italic emphasis without changing semantics</Text>
      <Text decoration="underline">Underlined text</Text>
      <Text decoration="line-through">Deprecated value</Text>
    </Stack>
  );
}
