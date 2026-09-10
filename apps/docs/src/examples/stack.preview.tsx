import { Stack } from "@flux-ui/react";

export default function Example() {
  return (
    <Stack gap="sm" className="demo-boundary">
      <div className="demo-block">First</div>
      <div className="demo-block">Second</div>
      <div className="demo-block">Third</div>
    </Stack>
  );
}
