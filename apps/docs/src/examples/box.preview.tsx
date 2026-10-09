import { Box, Text } from "@varua/flux-ui";

export default function Preview() {
  return (
    <Box
      as="section"
      aria-label="Project summary"
      padding={6}
      surface="subtle"
      border="all"
      radius="md"
    >
      <Text as="p">
        One native section, with shared surface and spacing tokens.
      </Text>
    </Box>
  );
}
