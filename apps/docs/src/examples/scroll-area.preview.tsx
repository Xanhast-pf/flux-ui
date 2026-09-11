import { Box, ScrollArea, Text } from "@flux-ui/react";

export default function Preview() {
  return (
    <ScrollArea aria-label="Scrollable example content" axis="horizontal">
      <Box padding="md" style={{ minInlineSize: "45rem" }}>
        <Text as="p">
          This wide sample uses native scrollbars. Resize the canvas and use the
          keyboard to inspect the overflow.
        </Text>
      </Box>
    </ScrollArea>
  );
}
