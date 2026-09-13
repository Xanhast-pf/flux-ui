import {
  Card,
  CodeBlock,
  Heading,
  SplitPane,
  Stack,
  Text,
} from "@flux-ui/react";
export default function Preview() {
  return (
    <SplitPane
      label="Resize explanation and source"
      defaultValue={45}
      min={20}
      max={75}
      first={
        <Card>
          <Stack gap="md">
            <Heading level={2} size="md">
              A resizable workbench
            </Heading>
            <Text>
              Drag the separator or focus it and use arrow keys. Shift makes
              one-percent adjustments; Home/End use the configured limits.
            </Text>
          </Stack>
        </Card>
      }
      second={
        <CodeBlock
          code={
            "<SplitPane\n  defaultValue={45}\n  first={<Preview />}\n  second={<Source />}\n/>"
          }
          label="SplitPane composition"
        />
      }
    />
  );
}
