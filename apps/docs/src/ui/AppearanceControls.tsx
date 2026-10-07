import { MoonIcon, SunIcon } from "@flux-ui/icons";
import {
  Accordion,
  Button,
  Callout,
  Checkbox,
  Code,
  CodeBlock,
  ColorPicker,
  ColorSwatch,
  Field,
  Grid,
  Heading,
  Inline,
  Input,
  Popover,
  Progress,
  RadioGroup,
  Select,
  Stack,
  StatusBadge,
  Switch,
  Text,
  ThemeScope,
  ToggleGroup,
} from "@flux-ui/react";
import { useEffect, useId, useMemo, useState } from "react";
import {
  isPalettePreset,
  palettePairings,
  palettePresets,
  paletteVariable,
  setPalettePreset,
  setSecondaryPalettePreset,
  setTheme,
  usePalettePreset,
  useSecondaryPalettePreset,
  useTheme,
  type PalettePreset,
  type SecondaryPalettePreset,
  type Theme,
} from "../lib/appearance.js";
import { harmonyLabel } from "../lib/paletteHarmony.js";
import {
  buildThemeOverrides,
  createTokenRouting,
  exportThemeCss,
  resolvedTokenValue,
  routeFor,
  semanticColorTokens,
  semanticTokenGroups,
  type PreviewMode,
  type SemanticTokenId,
  type TokenRoute,
  type TokenRouting,
  type TokenSource,
} from "../lib/themeConfigurator.js";

export function ThemeSwitch() {
  const theme = useTheme();
  return (
    <Inline gap="sm" align="center">
      <SunIcon aria-hidden="true" size={16} />
      <Text tone="muted">Dark theme</Text>
      <Switch
        aria-label="Dark theme"
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <MoonIcon aria-hidden="true" size={16} />
    </Inline>
  );
}

function PaletteSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: PalettePreset;
  onChange: (value: PalettePreset) => void;
}) {
  return (
    <Select
      id={id}
      aria-label="Primary palette"
      value={value}
      onChange={(event) => {
        const next = event.currentTarget.value;
        if (isPalettePreset(next)) onChange(next);
      }}
    >
      {palettePresets.map((entry) => (
        <option key={entry.id} value={entry.id}>
          {entry.label}
        </option>
      ))}
    </Select>
  );
}

type RecommendedPalette = {
  palette: PalettePreset;
  relationshipLabel: string;
};

function SecondaryPaletteSelect({
  id,
  primary,
  value,
  recommended,
  onChange,
}: {
  id: string;
  primary: PalettePreset;
  value: SecondaryPalettePreset;
  recommended: readonly RecommendedPalette[];
  onChange: (value: SecondaryPalettePreset) => void;
}) {
  const recommendedSet = new Set(recommended.map((entry) => entry.palette));
  const remaining = palettePresets
    .map((entry) => entry.id)
    .filter((entry) => entry !== primary && !recommendedSet.has(entry));
  return (
    <Select
      id={id}
      aria-label="Secondary palette"
      value={value ?? "off"}
      onChange={(event) => {
        const next = event.currentTarget.value;
        if (next === "off") onChange(null);
        else if (next !== primary && isPalettePreset(next)) onChange(next);
      }}
    >
      <option value="off">Off — Primary only</option>
      <optgroup label="Recommended matches">
        {recommended.map((entry) => (
          <option key={entry.palette} value={entry.palette}>
            {palettePresets.find((item) => item.id === entry.palette)?.label ??
              entry.palette}
            {" — "}
            {entry.relationshipLabel}
          </option>
        ))}
      </optgroup>
      <optgroup label="Other palettes">
        {remaining.map((entry) => (
          <option key={entry} value={entry}>
            {palettePresets.find((item) => item.id === entry)?.label ?? entry}
          </option>
        ))}
      </optgroup>
    </Select>
  );
}

function SourceOption({
  id,
  label,
  source,
  disabled = false,
}: {
  id: string;
  label: string;
  source: TokenSource;
  disabled?: boolean | undefined;
}) {
  return (
    <Field.Root controlId={id} disabled={disabled} density="compact">
      <Inline gap="xs" align="center">
        <Field.Control>
          <RadioGroup.Item value={source} />
        </Field.Control>
        <Field.Label>{label}</Field.Label>
      </Inline>
    </Field.Root>
  );
}

function CustomColorEditor({
  tokenId,
  label,
  route,
  onChange,
}: {
  tokenId: SemanticTokenId;
  label: string;
  route: TokenRoute;
  onChange: (route: TokenRoute) => void;
}) {
  const popupLabel = `Custom ${label} colors`;
  return (
    <Popover.Root>
      <Popover.Trigger size="sm" variant="outline">
        Edit light & dark
      </Popover.Trigger>
      <Popover.Popup aria-label={popupLabel}>
        <Stack gap="md">
          <Stack gap="xs">
            <Text weight="bold">Light</Text>
            <ColorPicker
              aria-label={`${label} light color`}
              value={route.custom.light}
              onValueChange={(value) =>
                onChange({
                  ...route,
                  custom: { ...route.custom, light: value },
                })
              }
            />
          </Stack>
          <Stack gap="xs">
            <Text weight="bold">Dark</Text>
            <ColorPicker
              aria-label={`${label} dark color`}
              value={route.custom.dark}
              onValueChange={(value) =>
                onChange({
                  ...route,
                  custom: { ...route.custom, dark: value },
                })
              }
            />
          </Stack>
          <Inline gap="xs" wrap>
            <Button
              size="sm"
              variant="ghost"
              tone="neutral"
              onClick={() =>
                onChange({
                  ...route,
                  custom: {
                    light: route.custom.light,
                    dark: route.custom.light,
                  },
                })
              }
            >
              Light → dark
            </Button>
            <Button
              size="sm"
              variant="ghost"
              tone="neutral"
              onClick={() =>
                onChange({
                  ...route,
                  custom: {
                    light: route.custom.dark,
                    dark: route.custom.dark,
                  },
                })
              }
            >
              Dark → light
            </Button>
            <Button
              size="sm"
              variant="ghost"
              tone="neutral"
              onClick={() =>
                onChange({
                  ...route,
                  custom: {
                    light: route.custom.dark,
                    dark: route.custom.light,
                  },
                })
              }
            >
              Swap
            </Button>
          </Inline>
          <Text variant="caption" tone="muted">
            Custom values bypass the preset contrast guarantees. Review both
            previews before exporting.
          </Text>
          <Text variant="caption" tone="muted">
            Token: {tokenId}
          </Text>
        </Stack>
      </Popover.Popup>
    </Popover.Root>
  );
}

function TokenRouteRow({
  tokenId,
  label,
  variable,
  primary,
  secondary,
  route,
  onChange,
}: {
  tokenId: SemanticTokenId;
  label: string;
  variable: string;
  primary: PalettePreset;
  secondary: SecondaryPalettePreset;
  route: TokenRoute;
  onChange: (route: TokenRoute) => void;
}) {
  const sourceLabel =
    route.source === "primary"
      ? "Primary"
      : route.source === "secondary"
        ? "Secondary"
        : "Custom";
  const light = resolvedTokenValue(tokenId, route, primary, secondary, "light");
  const dark = resolvedTokenValue(tokenId, route, primary, secondary, "dark");
  const sourceId = useId();
  const radioName = `${sourceId}-${tokenId}-source`;

  return (
    <Stack gap="sm" data-theme-token={tokenId}>
      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          md: "minmax(11rem, 1fr) auto",
        }}
        gap="md"
        align="center"
      >
        <Stack gap="xs">
          <Inline gap="sm" align="center" wrap>
            <Text weight="bold">{label}</Text>
            <StatusBadge
              tone={route.source === "custom" ? "warning" : "neutral"}
            >
              {sourceLabel}
            </StatusBadge>
          </Inline>
          <Code>{variable}</Code>
        </Stack>
        <Inline gap="md" wrap>
          <Inline gap="xs" align="center">
            <Text variant="caption" tone="muted">
              Light
            </Text>
            <ColorSwatch color={light} />
            {route.source === "custom" ? (
              <Code>{route.custom.light}</Code>
            ) : null}
          </Inline>
          <Inline gap="xs" align="center">
            <Text variant="caption" tone="muted">
              Dark
            </Text>
            <ColorSwatch color={dark} />
            {route.source === "custom" ? (
              <Code>{route.custom.dark}</Code>
            ) : null}
          </Inline>
        </Inline>
      </Grid>

      <Inline gap="md" align="center" wrap>
        <RadioGroup.Root
          aria-label={`${label} palette source`}
          name={radioName}
          value={route.source}
          onValueChange={(value) => {
            if (
              value === "primary" ||
              value === "secondary" ||
              value === "custom"
            )
              onChange({ ...route, source: value });
          }}
        >
          <Inline gap="md" wrap>
            <SourceOption
              id={`${radioName}-primary`}
              label="Primary"
              source="primary"
            />
            <SourceOption
              id={`${radioName}-secondary`}
              label="Secondary"
              source="secondary"
              disabled={secondary === null}
            />
            <SourceOption
              id={`${radioName}-custom`}
              label="Custom"
              source="custom"
            />
          </Inline>
        </RadioGroup.Root>
        {route.source === "custom" ? (
          <CustomColorEditor
            tokenId={tokenId}
            label={label}
            route={route}
            onChange={onChange}
          />
        ) : null}
      </Inline>
    </Stack>
  );
}

function ThemePreview({
  theme,
  primary,
  secondary,
  routing,
}: {
  theme: Theme;
  primary: PalettePreset;
  secondary: SecondaryPalettePreset;
  routing: TokenRouting;
}) {
  const overrides = useMemo(
    () => buildThemeOverrides(routing, secondary, theme),
    [routing, secondary, theme],
  );

  return (
    <ThemeScope
      colorOverrides={overrides}
      data-theme-preview={theme}
      data-flux-palette={primary}
      theme={theme}
      padding={5}
      radius="md"
      surface="default"
    >
      <Stack gap="lg">
        <Inline justify="between" align="center" gap="md" wrap>
          <Stack gap="xs">
            <Heading level={4} size="sm">
              {theme === "light" ? "Light" : "Dark"} preview
            </Heading>
            <Text variant="caption" tone="muted">
              Public Flux components under the resolved semantic tokens.
            </Text>
          </Stack>
          <StatusBadge tone="accent">Live</StatusBadge>
        </Inline>

        <Inline gap="sm" wrap>
          <Button size="sm">Primary action</Button>
          <Button size="sm" variant="soft">
            Soft action
          </Button>
          <Button size="sm" variant="outline" tone="neutral">
            Neutral
          </Button>
          <Button size="sm" tone="danger">
            Delete
          </Button>
        </Inline>

        <Inline gap="sm" wrap>
          <StatusBadge tone="accent">Accent</StatusBadge>
          <StatusBadge tone="success">Success</StatusBadge>
          <StatusBadge tone="warning">Warning</StatusBadge>
          <StatusBadge tone="danger">Danger</StatusBadge>
          <StatusBadge tone="info">Info</StatusBadge>
        </Inline>

        <Grid
          templateColumns={{ base: "minmax(0, 1fr)", md: "1fr 1fr" }}
          gap="md"
        >
          <Field.Root
            controlId={`theme-preview-${theme}-email`}
            density="compact"
          >
            <Field.Label>Email</Field.Label>
            <Field.Control>
              <Input type="email" defaultValue="hello@flux.dev" />
            </Field.Control>
            <Field.Description>Muted supporting text.</Field.Description>
          </Field.Root>
          <Field.Root
            controlId={`theme-preview-${theme}-plan`}
            density="compact"
          >
            <Field.Label>Plan</Field.Label>
            <Field.Control>
              <Select defaultValue="pro">
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
              </Select>
            </Field.Control>
          </Field.Root>
        </Grid>

        <Inline gap="lg" wrap align="center">
          <Checkbox aria-label="Email updates" defaultChecked />
          <Text>Email updates</Text>
          <Switch aria-label="Automatic sync" defaultChecked />
          <Text>Automatic sync</Text>
        </Inline>

        <Progress aria-label="Theme preview progress" value={72} max={100} />
        <Callout tone="info">
          Info surfaces expose soft, foreground, border, text, and focus tokens
          together.
        </Callout>
      </Stack>
    </ThemeScope>
  );
}

function AdvancedThemeConfigurator({
  primary,
  secondary,
  routing,
  setRouting,
}: {
  primary: PalettePreset;
  secondary: SecondaryPalettePreset;
  routing: TokenRouting;
  setRouting: (routing: Map<SemanticTokenId, TokenRoute>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedTokenId, setSelectedTokenId] =
    useState<SemanticTokenId>("accent");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("split");
  const [showExport, setShowExport] = useState(false);
  const exportCode = useMemo(
    () => (showExport ? exportThemeCss(routing, primary, secondary) : ""),
    [routing, primary, secondary, showExport],
  );

  function updateRoute(id: SemanticTokenId, route: TokenRoute): void {
    const next = new Map(routing);
    next.set(id, route);
    setRouting(next);
  }

  const overridden = [...routing.values()].filter(
    (route) => route.source !== "primary",
  ).length;
  const selectedToken =
    semanticColorTokens.find((token) => token.id === selectedTokenId) ??
    semanticColorTokens[0];

  return (
    <Accordion.Root type="single">
      <Accordion.Item
        onToggle={(event) => {
          setOpen(event.currentTarget.open);
        }}
      >
        <Accordion.Trigger>
          Advanced token routing · {overridden} customized
        </Accordion.Trigger>
        <Accordion.Content>
          {open ? (
            <Stack gap="xl">
              <Callout tone="accent">
                Route each semantic color independently. Primary keeps the
                normal Flux preset, Secondary uses the selected secondary ramp
                directly, and Custom owns an explicit Light/Dark pair. No
                primary-secondary hue blending is performed.
              </Callout>

              <Field.Root>
                <Field.Label>Token to customize</Field.Label>
                <Field.Control>
                  <Select
                    aria-label="Token to customize"
                    value={selectedTokenId}
                    onChange={(event) => {
                      const selected = semanticColorTokens.find(
                        (token) => token.id === event.currentTarget.value,
                      );
                      if (selected !== undefined)
                        setSelectedTokenId(selected.id);
                    }}
                  >
                    {semanticTokenGroups.map((group) => (
                      <optgroup key={group} label={group}>
                        {semanticColorTokens
                          .filter((token) => token.group === group)
                          .map((token) => {
                            const route = routeFor(routing, token.id);
                            const suffix =
                              route.source === "primary"
                                ? ""
                                : ` — ${route.source === "secondary" ? "Secondary" : "Custom"}`;
                            return (
                              <option key={token.id} value={token.id}>
                                {token.label}
                                {suffix}
                              </option>
                            );
                          })}
                      </optgroup>
                    ))}
                  </Select>
                </Field.Control>
                <Field.Description>
                  Choose one semantic token at a time. Customized tokens are
                  marked in the menu.
                </Field.Description>
              </Field.Root>

              <TokenRouteRow
                tokenId={selectedToken.id}
                label={selectedToken.label}
                variable={selectedToken.variable}
                primary={primary}
                secondary={secondary}
                route={routeFor(routing, selectedToken.id)}
                onChange={(route) => updateRoute(selectedToken.id, route)}
              />

              <Inline gap="sm" wrap>
                <Button
                  size="sm"
                  variant="outline"
                  tone="neutral"
                  onClick={() => setRouting(createTokenRouting())}
                >
                  Reset token routing
                </Button>
                <Button
                  size="sm"
                  aria-expanded={showExport}
                  onClick={() => setShowExport((value) => !value)}
                >
                  Export palette
                </Button>
              </Inline>

              {showExport ? (
                <CodeBlock
                  code={exportCode}
                  label="Your Flux theme CSS"
                  language="css"
                />
              ) : null}

              <Stack gap="md">
                <Inline justify="between" gap="md" align="center" wrap>
                  <Stack gap="xs">
                    <Heading level={3} size="sm">
                      Live component preview
                    </Heading>
                    <Text variant="caption" tone="muted">
                      Compare both theme modes without changing the surrounding
                      docs page.
                    </Text>
                  </Stack>
                  <ToggleGroup.Root
                    aria-label="Preview theme"
                    type="single"
                    value={previewMode}
                    onValueChange={(value) => {
                      if (
                        value === "light" ||
                        value === "dark" ||
                        value === "split"
                      )
                        setPreviewMode(value);
                    }}
                  >
                    <ToggleGroup.Item value="light">Light</ToggleGroup.Item>
                    <ToggleGroup.Item value="dark">Dark</ToggleGroup.Item>
                    <ToggleGroup.Item value="split">Split</ToggleGroup.Item>
                  </ToggleGroup.Root>
                </Inline>

                <Grid
                  templateColumns={{
                    base: "minmax(0, 1fr)",
                    lg:
                      previewMode === "split"
                        ? "minmax(0, 1fr) minmax(0, 1fr)"
                        : "minmax(0, 1fr)",
                  }}
                  gap="md"
                >
                  {previewMode === "dark" ? null : (
                    <ThemePreview
                      theme="light"
                      primary={primary}
                      secondary={secondary}
                      routing={routing}
                    />
                  )}
                  {previewMode === "light" ? null : (
                    <ThemePreview
                      theme="dark"
                      primary={primary}
                      secondary={secondary}
                      routing={routing}
                    />
                  )}
                </Grid>
              </Stack>
            </Stack>
          ) : null}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export function AppearanceControls() {
  const theme = useTheme();
  const primary = usePalettePreset();
  const secondary = useSecondaryPalettePreset();
  const primaryId = useId();
  const secondaryId = useId();
  const [routing, setRouting] = useState(createTokenRouting);
  const recommendations: RecommendedPalette[] = palettePairings(primary)
    .slice(0, 3)
    .flatMap((pairing) =>
      isPalettePreset(pairing.id)
        ? [
            {
              palette: pairing.id,
              relationshipLabel: harmonyLabel(pairing.harmony),
            },
          ]
        : [],
    );
  const selectedPrimary = palettePresets.find((entry) => entry.id === primary);
  const selectedSecondary =
    secondary === null
      ? null
      : palettePresets.find((entry) => entry.id === secondary);

  useEffect(() => {
    if (
      secondary !== null &&
      document.documentElement.dataset.fluxSecondaryPalette !== secondary
    )
      setSecondaryPalettePreset(secondary);
  }, [secondary]);

  function changeSecondary(next: SecondaryPalettePreset): void {
    setSecondaryPalettePreset(next);
    if (next !== null) return;
    const updated = new Map(routing);
    let changed = false;
    for (const [id, route] of updated) {
      if (route.source === "secondary") {
        updated.set(id, { ...route, source: "primary" });
        changed = true;
      }
    }
    if (changed) setRouting(updated);
  }

  return (
    <Stack gap="md">
      <ThemeSwitch />
      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          md: "minmax(0, 1fr) minmax(0, 1fr)",
        }}
        gap="md"
      >
        <Field.Root controlId={primaryId}>
          <Field.Label>Primary palette</Field.Label>
          <Inline gap="sm" align="center">
            <ColorSwatch
              color={paletteVariable(primary)}
              selected
              aria-hidden="true"
            />
            <Field.Control>
              <PaletteSelect
                id={primaryId}
                value={primary}
                onChange={setPalettePreset}
              />
            </Field.Control>
          </Inline>
          <Field.Description>{selectedPrimary?.description}</Field.Description>
        </Field.Root>

        <Field.Root controlId={secondaryId}>
          <Field.Label>Secondary palette</Field.Label>
          <Inline gap="sm" align="center">
            <ColorSwatch
              color={
                secondary === null ? "transparent" : paletteVariable(secondary)
              }
              selected={secondary !== null}
              aria-hidden="true"
            />
            <Field.Control>
              <SecondaryPaletteSelect
                id={secondaryId}
                primary={primary}
                value={secondary}
                recommended={recommendations}
                onChange={changeSecondary}
              />
            </Field.Control>
          </Inline>
          <Field.Description>
            {secondary === null
              ? "Primary only. Secondary token choices are disabled."
              : `${selectedSecondary?.label ?? secondary} is available as an independent token source; it is not blended into the primary palette.`}
          </Field.Description>
        </Field.Root>
      </Grid>

      <Stack gap="xs">
        <Text variant="caption" tone="muted">
          Recommended secondary matches
        </Text>
        <Inline gap="md" wrap>
          {recommendations.map((entry) => {
            const preset = palettePresets.find(
              (candidate) => candidate.id === entry.palette,
            );
            return (
              <Inline gap="xs" key={entry.palette} align="center">
                <ColorSwatch
                  color={paletteVariable(entry.palette)}
                  aria-hidden="true"
                />
                <Text variant="caption">
                  {preset?.label ?? entry.palette} · {entry.relationshipLabel}
                </Text>
              </Inline>
            );
          })}
        </Inline>
      </Stack>

      <Text variant="caption" tone="muted">
        Suggestions combine perceptual OKLab/OKLCH distance with
        split-complementary, complementary, and triadic hue relationships.
        Select a secondary palette, then decide exactly which semantic tokens
        should use it.
      </Text>

      <AdvancedThemeConfigurator
        primary={primary}
        secondary={secondary}
        routing={routing}
        setRouting={setRouting}
      />

      <Text variant="caption" tone="muted">
        Current docs theme: {theme}. The advanced preview is scoped and does not
        rewrite your saved global token configuration until you export and apply
        it in your project.
      </Text>
    </Stack>
  );
}
