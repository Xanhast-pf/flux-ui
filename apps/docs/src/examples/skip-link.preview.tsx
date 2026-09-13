import { useId, useRef } from "react";
import { Box, Heading, SkipLink, Stack, Text } from "@flux-ui/react";

export default function Preview() {
  const id = useId();
  const target = useRef<HTMLElement>(null);
  return (
    <Stack gap="md">
      <SkipLink
        href={`#${id}`}
        onClick={(event) => {
          // This hosted preview shares the URL hash with the docs router.
          // An ordinary document can use the native href without this adapter.
          event.preventDefault();
          target.current?.focus();
          target.current?.scrollIntoView({ block: "nearest" });
        }}
      >
        Skip this example introduction
      </SkipLink>
      <Text as="p">
        Use Tab to reveal the skip link, then follow it to the focusable target.
      </Text>
      <Box as="section" id={id} ref={target} tabIndex={-1}>
        <Heading level={2}>Example content</Heading>
      </Box>
    </Stack>
  );
}
