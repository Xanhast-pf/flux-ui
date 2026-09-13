import { Kbd, Stack, Text } from "@flux-ui/react";
export default function Example() {
  return (
    <Stack gap="md">
      <Text as="p" variant="body">
        Open docs search with <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>, or <Kbd>⌘</Kbd> +{" "}
        <Kbd>K</Kbd> on macOS.
      </Text>
      <Text as="p" variant="body">
        Navigate a toolbar with <Kbd>←</Kbd> and <Kbd>→</Kbd>. Activate its
        button with <Kbd>Enter</Kbd>.
      </Text>
    </Stack>
  );
}
