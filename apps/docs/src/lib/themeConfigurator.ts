import type { ThemeScopeColorOverrides } from "@flux-ui/react";
import type {
  PalettePreset,
  SecondaryPalettePreset,
  Theme,
} from "./appearance.js";

export type TokenSource = "primary" | "secondary" | "custom";
export type PreviewMode = Theme | "split";

type CustomPair = {
  light: string;
  dark: string;
};

type TokenDefinitionShape = {
  id: string;
  label: string;
  group: "Surfaces" | "Content" | "Structure" | "Accent" | "Feedback";
  variable: `--flux-color-${string}`;
  custom: CustomPair;
};

export const semanticColorTokens = [
  {
    id: "canvas",
    label: "Canvas",
    group: "Surfaces",
    variable: "--flux-color-canvas",
    custom: { light: "#f8fafc", dark: "#0b0f14" },
  },
  {
    id: "surface",
    label: "Surface",
    group: "Surfaces",
    variable: "--flux-color-surface",
    custom: { light: "#ffffff", dark: "#111720" },
  },
  {
    id: "surfaceSubtle",
    label: "Surface subtle",
    group: "Surfaces",
    variable: "--flux-color-surface-subtle",
    custom: { light: "#f1f5f9", dark: "#151d28" },
  },
  {
    id: "surfaceElevated",
    label: "Surface elevated",
    group: "Surfaces",
    variable: "--flux-color-surface-elevated",
    custom: { light: "#ffffff", dark: "#18212d" },
  },
  {
    id: "text",
    label: "Text",
    group: "Content",
    variable: "--flux-color-text",
    custom: { light: "#0f172a", dark: "#f8fafc" },
  },
  {
    id: "textMuted",
    label: "Text muted",
    group: "Content",
    variable: "--flux-color-text-muted",
    custom: { light: "#475569", dark: "#a8b3c2" },
  },
  {
    id: "textSubtle",
    label: "Text subtle",
    group: "Content",
    variable: "--flux-color-text-subtle",
    custom: { light: "#596980", dark: "#7f8b9b" },
  },
  {
    id: "border",
    label: "Border",
    group: "Structure",
    variable: "--flux-color-border",
    custom: { light: "#dbe2ea", dark: "#273241" },
  },
  {
    id: "borderStrong",
    label: "Border strong",
    group: "Structure",
    variable: "--flux-color-border-strong",
    custom: { light: "#8795aa", dark: "#596d84" },
  },
  {
    id: "focus",
    label: "Focus",
    group: "Structure",
    variable: "--flux-color-focus",
    custom: { light: "#6366f1", dark: "#a5b4fc" },
  },
  {
    id: "accent",
    label: "Accent",
    group: "Accent",
    variable: "--flux-color-accent",
    custom: { light: "#4f46e5", dark: "#a5b4fc" },
  },
  {
    id: "accentHover",
    label: "Accent hover",
    group: "Accent",
    variable: "--flux-color-accent-hover",
    custom: { light: "#4338ca", dark: "#a5b4fc" },
  },
  {
    id: "accentSoft",
    label: "Accent soft",
    group: "Accent",
    variable: "--flux-color-accent-soft",
    custom: { light: "#eef2ff", dark: "#1b2048" },
  },
  {
    id: "accentForeground",
    label: "Accent foreground",
    group: "Accent",
    variable: "--flux-color-accent-foreground",
    custom: { light: "#ffffff", dark: "#0d1020" },
  },
  {
    id: "success",
    label: "Success",
    group: "Feedback",
    variable: "--flux-color-success",
    custom: { light: "#15803d", dark: "#4ade80" },
  },
  {
    id: "successHover",
    label: "Success hover",
    group: "Feedback",
    variable: "--flux-color-success-hover",
    custom: { light: "#166534", dark: "#86efac" },
  },
  {
    id: "successSoft",
    label: "Success soft",
    group: "Feedback",
    variable: "--flux-color-success-soft",
    custom: { light: "#f0fdf4", dark: "#0d2115" },
  },
  {
    id: "successForeground",
    label: "Success foreground",
    group: "Feedback",
    variable: "--flux-color-success-foreground",
    custom: { light: "#ffffff", dark: "#07150c" },
  },
  {
    id: "warning",
    label: "Warning",
    group: "Feedback",
    variable: "--flux-color-warning",
    custom: { light: "#935a06", dark: "#fbbf24" },
  },
  {
    id: "warningHover",
    label: "Warning hover",
    group: "Feedback",
    variable: "--flux-color-warning-hover",
    custom: { light: "#854d0e", dark: "#fcd34d" },
  },
  {
    id: "warningSoft",
    label: "Warning soft",
    group: "Feedback",
    variable: "--flux-color-warning-soft",
    custom: { light: "#fffbeb", dark: "#261b05" },
  },
  {
    id: "warningForeground",
    label: "Warning foreground",
    group: "Feedback",
    variable: "--flux-color-warning-foreground",
    custom: { light: "#ffffff", dark: "#1b1200" },
  },
  {
    id: "danger",
    label: "Danger",
    group: "Feedback",
    variable: "--flux-color-danger",
    custom: { light: "#c52222", dark: "#fb7185" },
  },
  {
    id: "dangerHover",
    label: "Danger hover",
    group: "Feedback",
    variable: "--flux-color-danger-hover",
    custom: { light: "#b91c1c", dark: "#fda4af" },
  },
  {
    id: "dangerSoft",
    label: "Danger soft",
    group: "Feedback",
    variable: "--flux-color-danger-soft",
    custom: { light: "#fff5f5", dark: "#2a1118" },
  },
  {
    id: "dangerForeground",
    label: "Danger foreground",
    group: "Feedback",
    variable: "--flux-color-danger-foreground",
    custom: { light: "#ffffff", dark: "#26080e" },
  },
  {
    id: "info",
    label: "Info",
    group: "Feedback",
    variable: "--flux-color-info",
    custom: { light: "#0369a1", dark: "#38bdf8" },
  },
  {
    id: "infoHover",
    label: "Info hover",
    group: "Feedback",
    variable: "--flux-color-info-hover",
    custom: { light: "#075985", dark: "#7dd3fc" },
  },
  {
    id: "infoSoft",
    label: "Info soft",
    group: "Feedback",
    variable: "--flux-color-info-soft",
    custom: { light: "#f0f9ff", dark: "#08202b" },
  },
  {
    id: "infoForeground",
    label: "Info foreground",
    group: "Feedback",
    variable: "--flux-color-info-foreground",
    custom: { light: "#ffffff", dark: "#06131a" },
  },
] as const satisfies readonly TokenDefinitionShape[];

export type SemanticTokenId = (typeof semanticColorTokens)[number]["id"];
export type SemanticColorVariable =
  (typeof semanticColorTokens)[number]["variable"];
export type TokenRoute = {
  source: TokenSource;
  custom: CustomPair;
};
export type TokenRouting = ReadonlyMap<SemanticTokenId, TokenRoute>;
export type ThemeOverrideStyle = ThemeScopeColorOverrides;

export const semanticTokenGroups = [
  "Surfaces",
  "Content",
  "Structure",
  "Accent",
  "Feedback",
] as const;

function paletteVariable(palette: PalettePreset, step: number): string {
  return `var(--flux-palette-${palette}-${step})`;
}

function isStatusToken(id: SemanticTokenId): boolean {
  return (
    id.startsWith("success") ||
    id.startsWith("warning") ||
    id.startsWith("danger") ||
    id.startsWith("info")
  );
}

function statusPalette(id: SemanticTokenId): PalettePreset {
  if (id.startsWith("success")) return "emerald";
  if (id.startsWith("warning")) return "amber";
  if (id.startsWith("danger")) return "rose";
  return "blue";
}

function toneStep(
  id: SemanticTokenId,
  theme: Theme,
  paletteSource: "primary" | "secondary",
): number | null {
  if (id.endsWith("Foreground")) return null;
  if (id.endsWith("Soft")) return theme === "light" ? 100 : 900;
  if (id.endsWith("Hover")) {
    if (
      paletteSource === "primary" &&
      id.startsWith("warning") &&
      theme === "light"
    )
      return 900;
    return theme === "light" ? 800 : 200;
  }
  if (id === "warning" && paletteSource === "primary" && theme === "light")
    return 800;
  return theme === "light" ? 700 : 300;
}

function primaryPresetValue(
  id: SemanticTokenId,
  palette: PalettePreset,
  theme: Theme,
): string {
  if (isStatusToken(id)) {
    const semanticPalette = statusPalette(id);
    const step = toneStep(id, theme, "primary");
    if (step === null)
      return theme === "light"
        ? "#ffffff"
        : paletteVariable(semanticPalette, 950);
    if (id.endsWith("Soft") && theme === "dark") {
      const percent = id.startsWith("warning") ? 68 : 70;
      return `color-mix(in oklab, ${paletteVariable(semanticPalette, 900)} ${percent}%, #111720)`;
    }
    return paletteVariable(semanticPalette, step);
  }

  switch (id) {
    case "canvas":
      return theme === "light"
        ? `color-mix(in oklab, ${paletteVariable(palette, 50)} 70%, white)`
        : `color-mix(in oklab, ${paletteVariable(palette, 950)} 52%, #070a0e)`;
    case "surface":
      return theme === "light"
        ? "#ffffff"
        : `color-mix(in oklab, ${paletteVariable(palette, 950)} 34%, #111720)`;
    case "surfaceSubtle":
      return theme === "light"
        ? paletteVariable(palette, 50)
        : `color-mix(in oklab, ${paletteVariable(palette, 900)} 38%, #151d28)`;
    case "surfaceElevated":
      return theme === "light"
        ? "#ffffff"
        : `color-mix(in oklab, ${paletteVariable(palette, 900)} 32%, #18212d)`;
    case "text":
      return paletteVariable("slate", theme === "light" ? 950 : 50);
    case "textMuted":
      return paletteVariable("slate", theme === "light" ? 600 : 300);
    case "textSubtle":
      return paletteVariable("slate", theme === "light" ? 600 : 400);
    case "border":
      return theme === "light"
        ? paletteVariable(palette, 200)
        : `color-mix(in oklab, ${paletteVariable(palette, 700)} 38%, #273241)`;
    case "borderStrong":
      return paletteVariable(palette, theme === "light" ? 600 : 500);
    case "focus":
      return paletteVariable(palette, theme === "light" ? 600 : 300);
    case "accent":
      return paletteVariable(palette, theme === "light" ? 700 : 300);
    case "accentHover":
      return paletteVariable(palette, theme === "light" ? 800 : 200);
    case "accentSoft":
      return theme === "light"
        ? paletteVariable(palette, 100)
        : `color-mix(in oklab, ${paletteVariable(palette, 900)} 72%, #111720)`;
    case "accentForeground":
      return theme === "light" ? "#ffffff" : paletteVariable(palette, 950);
  }
  throw new Error(`Unsupported primary semantic token: ${id}`);
}

function secondaryPaletteValue(
  id: SemanticTokenId,
  palette: PalettePreset,
  theme: Theme,
): string {
  switch (id) {
    case "canvas":
      return paletteVariable(palette, theme === "light" ? 50 : 950);
    case "surface":
      return paletteVariable(palette, theme === "light" ? 50 : 950);
    case "surfaceSubtle":
      return paletteVariable(palette, theme === "light" ? 100 : 900);
    case "surfaceElevated":
      return paletteVariable(palette, theme === "light" ? 50 : 900);
    case "text":
      return paletteVariable(palette, theme === "light" ? 950 : 50);
    case "textMuted":
      return paletteVariable(palette, theme === "light" ? 700 : 300);
    case "textSubtle":
      return paletteVariable(palette, theme === "light" ? 600 : 400);
    case "border":
      return paletteVariable(palette, theme === "light" ? 200 : 700);
    case "borderStrong":
      return paletteVariable(palette, theme === "light" ? 600 : 500);
    case "focus":
      return paletteVariable(palette, theme === "light" ? 600 : 300);
    default: {
      const step = toneStep(id, theme, "secondary");
      return step === null
        ? theme === "light"
          ? "#ffffff"
          : paletteVariable(palette, 950)
        : paletteVariable(palette, step);
    }
  }
}

export function createTokenRouting(): Map<SemanticTokenId, TokenRoute> {
  return new Map(
    semanticColorTokens.map((token) => [
      token.id,
      { source: "primary" as const, custom: { ...token.custom } },
    ]),
  );
}

export function routeFor(
  routing: TokenRouting,
  id: SemanticTokenId,
): TokenRoute {
  const route = routing.get(id);
  if (route !== undefined) return route;
  const token = semanticColorTokens.find((entry) => entry.id === id);
  if (token === undefined) throw new Error(`Unknown semantic token: ${id}`);
  return { source: "primary", custom: { ...token.custom } };
}

export function resolvedTokenValue(
  id: SemanticTokenId,
  route: TokenRoute,
  primary: PalettePreset,
  secondary: SecondaryPalettePreset,
  theme: Theme,
): string {
  if (route.source === "custom") return route.custom[theme];
  if (route.source === "secondary" && secondary !== null)
    return secondaryPaletteValue(id, secondary, theme);
  return primaryPresetValue(id, primary, theme);
}

export function buildThemeOverrides(
  routing: TokenRouting,
  secondary: SecondaryPalettePreset,
  theme: Theme,
): ThemeOverrideStyle {
  const style: ThemeOverrideStyle = {};
  for (const token of semanticColorTokens) {
    const route = routeFor(routing, token.id);
    if (route.source === "custom") style[token.variable] = route.custom[theme];
    else if (route.source === "secondary" && secondary !== null)
      style[token.variable] = secondaryPaletteValue(token.id, secondary, theme);
  }
  return style;
}

export function exportThemeCss(
  routing: TokenRouting,
  primary: PalettePreset,
  secondary: SecondaryPalettePreset,
): string {
  const declarations = (theme: Theme): string[] => {
    const lines: string[] = [];
    for (const token of semanticColorTokens) {
      const route = routeFor(routing, token.id);
      if (route.source === "primary") continue;
      const value =
        route.source === "custom"
          ? route.custom[theme]
          : secondary === null
            ? primaryPresetValue(token.id, primary, theme)
            : secondaryPaletteValue(token.id, secondary, theme);
      lines.push(`  ${token.variable}: ${value};`);
    }
    return lines;
  };

  const light = declarations("light");
  const dark = declarations("dark");
  const secondaryLabel = secondary ?? "off";
  const body =
    light.length === 0 && dark.length === 0
      ? "/* No token overrides: the selected primary preset is unchanged. */"
      : [
          '.flux-custom-theme[data-flux-theme="light"] {',
          ...light,
          "}",
          "",
          '.flux-custom-theme[data-flux-theme="dark"] {',
          ...dark,
          "}",
        ].join("\n");

  return [
    "/* Flux UI theme override.",
    " * Load after @flux-ui/tokens/theme.css, palette.css, and presets.css.",
    ` * Apply class="flux-custom-theme" with data-flux-theme and data-flux-palette="${primary}".`,
    ` * Configurator palettes: primary=${primary}, secondary=${secondaryLabel}.`,
    " */",
    body,
  ].join("\n");
}
