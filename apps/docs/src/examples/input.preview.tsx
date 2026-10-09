import { Input, Stack } from "@varua/flux-ui";

export default function Example() {
  return (
    <Stack gap="md">
      <Input
        aria-label="Email address"
        type="email"
        placeholder="jo@example.com"
      />
      <Input
        aria-label="Read-only value"
        defaultValue="Read-only value"
        readOnly
      />
      <Input aria-label="Disabled input" defaultValue="Unavailable" disabled />
    </Stack>
  );
}
