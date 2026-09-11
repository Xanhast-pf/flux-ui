import { Box, Heading, SkipLink, Stack, Text } from "@flux-ui/react";

export default function Preview() {
  return (
    <Stack gap="md">
      <SkipLink href="#skip-link-example-target">
        Skip this example introduction
      </SkipLink>
      <Text as="p">
        Use Tab to reveal the skip link, then follow it to the focusable target.
      </Text>
      <Box as="section" id="skip-link-example-target" tabIndex={-1}>
        <Heading level={2}>Example content</Heading>
      </Box>
    </Stack>
  );
}
