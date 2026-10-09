import { Box, Card, Container, Text } from "@varua/flux-ui";
export default function Example() {
  return (
    <Box surface="subtle" paddingBlock="md">
      <Container size="sm">
        <Card>
          <Text>Small container</Text>
        </Card>
      </Container>
    </Box>
  );
}
