import { Button, Tooltip } from "@flux-ui/react";
export default function Example() {
  return (
    <Tooltip content="This control saves only a local draft; no data is sent.">
      <Button variant="outline">Save draft</Button>
    </Tooltip>
  );
}
