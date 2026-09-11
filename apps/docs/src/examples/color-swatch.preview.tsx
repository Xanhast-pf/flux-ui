import { ColorSwatch, Inline, Text } from "@flux-ui/react";

export default function Preview() {
  return (
    <Inline gap="md">
      <ColorSwatch color="var(--flux-color-accent)" selected />
      <Text>Accent color — sample selection</Text>
      <ColorSwatch color="var(--flux-color-success)" />
      <Text>Success color</Text>
    </Inline>
  );
}
