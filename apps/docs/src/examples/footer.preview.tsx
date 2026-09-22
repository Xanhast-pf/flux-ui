import { Footer, Inline, Link, Stack, Text } from "@flux-ui/react";

export default function Preview() {
  return (
    <Stack gap="md">
      <Text>
        Page content can stay short without leaving the footer floating halfway
        up the viewport.
      </Text>
      <Footer>
        <Inline justify="between" gap="md" wrap>
          <Text variant="caption" tone="muted">
            Acme Console
          </Text>
          <Link href="#footer">Documentation</Link>
        </Inline>
      </Footer>
    </Stack>
  );
}
