import { Dialog } from "@flux-ui/react";

export default function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Title>Project settings</Dialog.Title>
        <Dialog.Description>
          Native dialog semantics handle the modal top layer and focus boundary.
        </Dialog.Description>
        <Dialog.Close>Close dialog</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
