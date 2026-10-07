import {
  Code,
  ColorPicker,
  ColorSwatch,
  Inline,
  Stack,
  Text,
} from "@flux-ui/react";
import { useState } from "react";

export default function Preview() {
  const [color, setColor] = useState("#6366f1");
  return (
    <Stack gap="md">
      <ColorPicker
        aria-label="Brand color"
        value={color}
        onValueChange={setColor}
      />
      <Inline gap="sm" align="center">
        <ColorSwatch color={color} size="lg" />
        <Text>Current value</Text>
        <Code>{color}</Code>
      </Inline>
    </Stack>
  );
}
