import { Field, Popover, Stack, Switch } from "@flux-ui/react";
export default function Example() {
  return (
    <Popover.Root>
      <Popover.Trigger>Notification settings</Popover.Trigger>
      <Popover.Popup aria-label="Notification settings">
        <Stack gap="md">
          <Field.Root description="This is a local preference, not a server update.">
            <Field.Label>Weekly summary</Field.Label>
            <Field.Control>
              <Switch defaultChecked />
            </Field.Control>
          </Field.Root>
          <Popover.Close>Done</Popover.Close>
        </Stack>
      </Popover.Popup>
    </Popover.Root>
  );
}
