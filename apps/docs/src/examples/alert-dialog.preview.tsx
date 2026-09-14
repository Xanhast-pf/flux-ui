import { AlertDialog, Button, Inline, Stack, Text } from "@flux-ui/react";
import { useState } from "react";
export default function Example() {
  const [open, setOpen] = useState(false);
  const [discarded, setDiscarded] = useState(false);
  return (
    <Stack gap="md">
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger>Discard local draft</AlertDialog.Trigger>
        <AlertDialog.Popup>
          <AlertDialog.Title>Discard this draft?</AlertDialog.Title>
          <AlertDialog.Description>
            This changes the local example only. There is no remote deletion.
          </AlertDialog.Description>
          <Inline wrap gap="sm">
            <AlertDialog.Close>Keep draft</AlertDialog.Close>
            <Button
              tone="danger"
              onClick={() => {
                setDiscarded(true);
                setOpen(false);
              }}
            >
              Discard draft
            </Button>
          </Inline>
        </AlertDialog.Popup>
      </AlertDialog.Root>
      <Text role="status">
        {discarded
          ? "Local draft discarded."
          : "Your draft is still available."}
      </Text>
    </Stack>
  );
}
