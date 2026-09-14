import { DropdownMenu, Stack, Text } from "@flux-ui/react";
import { useState } from "react";
export default function Example() {
  const [action, setAction] = useState("No action selected.");
  return (
    <Stack gap="md">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Project actions</DropdownMenu.Trigger>
        <DropdownMenu.Popup aria-label="Project actions">
          <DropdownMenu.Label>Local draft</DropdownMenu.Label>
          <DropdownMenu.Item
            onSelect={() => setAction("A local duplicate was requested.")}
          >
            Duplicate
          </DropdownMenu.Item>
          <DropdownMenu.Item disabled>Publish (unavailable)</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            onSelect={() => setAction("A local export was requested.")}
          >
            Export
          </DropdownMenu.Item>
        </DropdownMenu.Popup>
      </DropdownMenu.Root>
      <Text role="status">{action}</Text>
    </Stack>
  );
}
