import { Kbd, Stack } from "@flux-ui/react";
export default function Example() {
  return (
    <Stack gap="md">
      <p>
        Open docs search with <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>, or <Kbd>⌘</Kbd> +{" "}
        <Kbd>K</Kbd> on macOS.
      </p>
      <p>
        Navigate a toolbar with <Kbd>←</Kbd> and <Kbd>→</Kbd>. Activate its
        button with <Kbd>Enter</Kbd>.
      </p>
    </Stack>
  );
}
