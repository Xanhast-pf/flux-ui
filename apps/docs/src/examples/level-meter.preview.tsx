import { Inline, LevelMeter, Stack, Text } from "@flux-ui/react";
export default function Preview() {
  return (
    <Stack gap="md">
      <Text weight="bold">Levels supplied by the application</Text>
      <Inline gap="lg" align="end">
        <LevelMeter aria-label="Left channel" value={-18} peak={-6} />
        <LevelMeter
          aria-label="Right channel clipping"
          value={0}
          peak={0}
          clipped
        />
      </Inline>
      <LevelMeter
        aria-label="Horizontal bus"
        value={-9}
        peak={-3}
        orientation="horizontal"
      />
      <Text tone="muted">
        Peak hold and clip reset belong to your audio engine. The component has
        no timer, microphone permission or DSP dependency.
      </Text>
    </Stack>
  );
}
