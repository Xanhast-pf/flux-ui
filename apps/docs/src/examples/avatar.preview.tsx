import { Avatar, Button, Inline, Stack } from "@flux-ui/react";
import { useState } from "react";
const illustration =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" fill="#334155"/><circle cx="48" cy="34" r="17" fill="#e2e8f0"/><path d="M14 96V84a34 34 0 0 1 68 0v12" fill="#e2e8f0"/></svg>',
  );
export default function Example() {
  const [broken, setBroken] = useState(false);
  return (
    <Stack gap="md">
      <Inline gap="md" wrap>
        <Avatar
          src={broken ? "data:image/png;base64,broken" : illustration}
          alt="Demo teammate"
          fallback="FL"
          size="lg"
        />
        <Avatar alt="Design team" fallback="DS" />
        <Avatar alt="" fallback="QA" size="sm" />
        <span>QA team (named by this text)</span>
      </Inline>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => {
          setBroken((value) => !value);
        }}
      >
        {broken ? "Restore avatar image" : "Break avatar image"}
      </Button>
    </Stack>
  );
}
