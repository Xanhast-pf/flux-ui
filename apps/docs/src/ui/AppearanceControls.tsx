import { MoonIcon, SunIcon } from "@flux-ui/icons";
import { Field, Inline, Select, Stack, Switch, Text } from "@flux-ui/react";
import {
  isPalettePreset,
  palettePresets,
  setPalettePreset,
  setTheme,
  usePalettePreset,
  useTheme,
} from "../lib/appearance.js";

export function ThemeSwitch() {
  const theme = useTheme();
  return (
    <Inline gap="sm">
      <SunIcon aria-hidden="true" size={16} />
      <Text tone="muted">Dark theme</Text>
      <Switch
        aria-label="Dark theme"
        checked={theme === "dark"}
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light");
        }}
      />
      <MoonIcon aria-hidden="true" size={16} />
    </Inline>
  );
}

export function AppearanceControls() {
  const palette = usePalettePreset();
  const current =
    palettePresets.find((preset) => preset.id === palette) ?? palettePresets[1];

  return (
    <Stack gap="md">
      <ThemeSwitch />
      <Field.Root>
        <Field.Label>Theme palette</Field.Label>
        <Field.Control>
          <Select
            value={palette}
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (isPalettePreset(value)) setPalettePreset(value);
            }}
          >
            {palettePresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </Select>
        </Field.Control>
        <Field.Description>{current.description}</Field.Description>
      </Field.Root>
      <Text as="p" variant="caption" tone="muted">
        Saved locally. Mode and palette remap semantic CSS variables across the
        entire documentation site without changing component APIs.
      </Text>
    </Stack>
  );
}
