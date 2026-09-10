import { Drawer } from "@flux-ui/react";

export default function Example() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>Open drawer</Drawer.Trigger>
      <Drawer.Popup side="right">
        <Drawer.Title>Project navigation</Drawer.Title>
        <Drawer.Description>
          Drawers reuse the same native modal behavior while changing spatial
          presentation.
        </Drawer.Description>
        <Drawer.Close>Close drawer</Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  );
}
