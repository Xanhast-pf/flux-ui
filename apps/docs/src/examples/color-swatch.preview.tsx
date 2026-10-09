import { ColorSwatch, Inline, Text } from "@varua/flux-ui";

export default function Preview() {
  return (
    <Inline gap="md">
      <ColorSwatch color="var(--flux-color-accent)" selected />
      <Text>Accent color (example)</Text>
      <ColorSwatch color="var(--flux-color-success)" />
      <Text>Success color</Text>
    </Inline>
  );
}
