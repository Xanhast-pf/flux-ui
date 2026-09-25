import { MoonIcon, SunIcon } from "@flux-ui/icons";
import {
  ColorSwatch,
  Field,
  Grid,
  Inline,
  Select,
  Stack,
  Switch,
  Text,
} from "@flux-ui/react";
import { useEffect } from "react";
import {
  isPalettePreset,
  palettePairings,
  palettePresets,
  paletteVariable,
  SECONDARY_PALETTE_OFF,
  setPalettePreset,
  setSecondaryPalettePreset,
  setTheme,
  usePalettePreset,
  useSecondaryPalettePreset,
  useTheme,
} from "../lib/appearance.js";
import { harmonyLabel } from "../lib/paletteHarmony.js";

export function ThemeSwitch() {
  const theme = useTheme();

  return (
    <Inline gap="sm" align="center">
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
  const primary = usePalettePreset();
  const secondary = useSecondaryPalettePreset();
  const primaryPreset =
    palettePresets.find((preset) => preset.id === primary) ?? palettePresets[1];
  const secondaryPreset =
    secondary === null
      ? undefined
      : palettePresets.find((preset) => preset.id === secondary);
  const pairings = palettePairings(primary);
  const recommended = pairings.slice(0, 3);
  const recommendedIds = new Set(recommended.map((pairing) => pairing.id));
  const otherPalettes = palettePresets.filter(
    (preset) => preset.id !== primary && !recommendedIds.has(preset.id),
  );
  const selectedPairing = pairings.find((pairing) => pairing.id === secondary);

  useEffect(() => {
    if (
      secondary !== null &&
      document.documentElement.dataset.fluxSecondaryPalette !== secondary
    )
      setSecondaryPalettePreset(secondary);
  }, [secondary]);

  return (
    <Stack gap="md">
      <ThemeSwitch />

      <Grid minColumnWidth="13rem" gap="md" align="start">
        <Field.Root>
          <Field.Label>Primary palette</Field.Label>
          <Inline gap="sm" align="center">
            <ColorSwatch color={paletteVariable(primary)} size="md" selected />
            <Field.Control>
              <Select
                value={primary}
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
          </Inline>
          <Field.Description>{primaryPreset.description}</Field.Description>
        </Field.Root>

        <Field.Root>
          <Field.Label>Secondary palette</Field.Label>
          <Inline gap="sm" align="center">
            <ColorSwatch
              color={
                secondary === null ? "transparent" : paletteVariable(secondary)
              }
              size="md"
              selected={secondary !== null}
            />
            <Field.Control>
              <Select
                value={secondary ?? SECONDARY_PALETTE_OFF}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  if (value === SECONDARY_PALETTE_OFF)
                    setSecondaryPalettePreset(null);
                  else if (isPalettePreset(value))
                    setSecondaryPalettePreset(value);
                }}
              >
                <option value={SECONDARY_PALETTE_OFF}>
                  Off — Primary only
                </option>
                <optgroup label="Recommended matches">
                  {recommended.map((pairing) => {
                    const preset = palettePresets.find(
                      (entry) => entry.id === pairing.id,
                    );
                    return preset ? (
                      <option key={preset.id} value={preset.id}>
                        {preset.label} — {harmonyLabel(pairing.harmony)}
                      </option>
                    ) : null;
                  })}
                </optgroup>
                {otherPalettes.length > 0 ? (
                  <optgroup label="Other palettes">
                    {otherPalettes.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.label}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
              </Select>
            </Field.Control>
          </Inline>
          <Field.Description>
            {secondary === null
              ? "Primary only. This keeps the original single-palette appearance."
              : selectedPairing === undefined
                ? secondaryPreset?.description
                : `${harmonyLabel(selectedPairing.harmony)} pairing with ${primaryPreset.label}; perceptually separated in OKLab/OKLCH.`}
          </Field.Description>
        </Field.Root>
      </Grid>

      <Stack gap="xs">
        <Text as="p" variant="caption" tone="muted">
          Recommended secondary matches
        </Text>
        <Inline gap="md" wrap>
          {recommended.map((pairing) => {
            const preset = palettePresets.find(
              (entry) => entry.id === pairing.id,
            );
            return preset ? (
              <Inline key={preset.id} gap="xs" align="center">
                <ColorSwatch
                  color={paletteVariable(preset.id)}
                  size="sm"
                  selected={preset.id === secondary}
                />
                <Text variant="caption">
                  {preset.label} · {harmonyLabel(pairing.harmony)}
                </Text>
              </Inline>
            ) : null;
          })}
        </Inline>
      </Stack>

      <Text as="p" variant="caption" tone="muted">
        Secondary suggestions combine perceptual OKLab/OKLCH distance with
        split-complementary, complementary, and triadic hue relationships. Turn
        the secondary palette off at any time to return to the original
        single-palette appearance.
      </Text>
    </Stack>
  );
}
