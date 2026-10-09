import { Footer, Inline, Link, Stack, Text } from "@varua/flux-ui";

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
          <Link href="#documentation">Documentation</Link>
        </Inline>
      </Footer>
    </Stack>
  );
}
