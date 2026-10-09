import { Button, Tooltip } from "@varua/flux-ui";

export default function Example() {
  return (
    <Tooltip
      content="This control saves only a local draft; no data is sent."
      arrow
    >
      <Button variant="outline">Save draft</Button>
    </Tooltip>
  );
}
