import { useSyncExternalStore } from "react";
import { rankPalettePairings } from "./paletteHarmony.js";

export type Theme = "light" | "dark";

export const palettePresets = [
  {
    id: "slate",
    label: "Graphite",
    sampleHex: "#64748b",
    description: "Neutral graphite surfaces with a precise monochrome accent.",
  },
  {
    id: "indigo",
    label: "Indigo",
    sampleHex: "#6366f1",
    description: "The Flux default: cool indigo with crisp blue-violet energy.",
  },
  {
    id: "blue",
    label: "Cobalt",
    sampleHex: "#3b82f6",
    description:
      "Clear blue surfaces tuned for product and data-heavy interfaces.",
  },
  {
    id: "cyan",
    label: "Arctic",
    sampleHex: "#06b6d4",
    description: "Bright cyan energy over cool, airy surfaces.",
  },
  {
    id: "teal",
    label: "Lagoon",
    sampleHex: "#14b8a6",
    description: "A restrained teal palette with calm aquatic contrast.",
  },
  {
    id: "emerald",
    label: "Grove",
    sampleHex: "#10b981",
    description: "Deep emerald accents with quiet botanical surfaces.",
  },
  {
    id: "green",
    label: "Meadow",
    sampleHex: "#22c55e",
    description: "Fresh green with balanced neutral text and status colors.",
  },
  {
    id: "lime",
    label: "Citrus",
    sampleHex: "#84cc16",
    description: "A sharper lime accent grounded by dark readable neutrals.",
  },
  {
    id: "amber",
    label: "Amber",
    sampleHex: "#f59e0b",
    description: "Warm gold surfaces with a richer, editorial accent.",
  },
  {
    id: "orange",
    label: "Ember",
    sampleHex: "#f97316",
    description: "Warm orange energy without sacrificing semantic contrast.",
  },
  {
    id: "rose",
    label: "Rose",
    sampleHex: "#f43f5e",
    description: "A composed rose palette with soft pink surfaces.",
  },
  {
    id: "violet",
    label: "Violet",
    sampleHex: "#8b5cf6",
    description: "Deep violet accents with cool, expressive surfaces.",
  },
  {
    id: "fuchsia",
    label: "Fuchsia",
    sampleHex: "#d946ef",
    description: "High-character magenta balanced by restrained neutral text.",
  },
] as const;

export type PalettePreset = (typeof palettePresets)[number]["id"];
export type SecondaryPalettePreset = PalettePreset | null;

export const SECONDARY_PALETTE_OFF = "off" as const;

const EVENT = "flux-docs-appearance";
const SECONDARY_STORAGE_KEY = "flux-ui-docs-secondary-palette";

function subscribe(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  return () => {
    window.removeEventListener(EVENT, listener);
  };
}

function themeSnapshot(): Theme {
  return document.documentElement.dataset.fluxTheme === "dark"
    ? "dark"
    : "light";
}

export function isPalettePreset(value: string): value is PalettePreset {
  return palettePresets.some((preset) => preset.id === value);
}

function paletteSnapshot(): PalettePreset {
  const palette = document.documentElement.dataset.fluxPalette;
  return palette !== undefined && isPalettePreset(palette) ? palette : "indigo";
}

export function paletteVariable(
  palette: PalettePreset,
  step: 100 | 400 | 500 | 600 | 900 | 950 = 500,
): string {
  return `var(--flux-palette-${palette}-${step})`;
}

export function palettePairings(primary: PalettePreset) {
  return rankPalettePairings(primary, palettePresets);
}

export function recommendedSecondaryPalette(
  primary: PalettePreset,
): PalettePreset {
  const recommended = palettePairings(primary)[0]?.id;
  return recommended !== undefined && isPalettePreset(recommended)
    ? recommended
    : primary === "amber"
      ? "indigo"
      : "amber";
}

function secondaryPaletteSnapshot(): SecondaryPalettePreset {
  const root = document.documentElement;
  if (root.dataset.fluxSecondaryPaletteMode === SECONDARY_PALETTE_OFF)
    return null;

  const primary = paletteSnapshot();
  const secondary = root.dataset.fluxSecondaryPalette;

  return secondary !== undefined &&
    isPalettePreset(secondary) &&
    secondary !== primary
    ? secondary
    : recommendedSecondaryPalette(primary);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, themeSnapshot, () => "light");
}

export function usePalettePreset(): PalettePreset {
  return useSyncExternalStore(subscribe, paletteSnapshot, () => "indigo");
}

export function useSecondaryPalettePreset(): SecondaryPalettePreset {
  return useSyncExternalStore(subscribe, secondaryPaletteSnapshot, () =>
    recommendedSecondaryPalette("indigo"),
  );
}

function persist(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* Preferences remain usable without storage. */
  }
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.fluxTheme = theme;
  persist("flux-ui-theme", theme);
  window.dispatchEvent(new Event(EVENT));
}

export function setPalettePreset(palette: PalettePreset): void {
  const root = document.documentElement;
  root.dataset.fluxPalette = palette;
  persist("flux-ui-docs-palette", palette);

  if (root.dataset.fluxSecondaryPaletteMode !== SECONDARY_PALETTE_OFF) {
    const recommended = recommendedSecondaryPalette(palette);
    root.dataset.fluxSecondaryPalette = recommended;
    delete root.dataset.fluxSecondaryPaletteMode;
    persist(SECONDARY_STORAGE_KEY, recommended);
  }

  window.dispatchEvent(new Event(EVENT));
}

export function setSecondaryPalettePreset(
  palette: SecondaryPalettePreset,
): void {
  const root = document.documentElement;

  if (palette === null) {
    delete root.dataset.fluxSecondaryPalette;
    root.dataset.fluxSecondaryPaletteMode = SECONDARY_PALETTE_OFF;
    persist(SECONDARY_STORAGE_KEY, SECONDARY_PALETTE_OFF);
  } else {
    root.dataset.fluxSecondaryPalette = palette;
    delete root.dataset.fluxSecondaryPaletteMode;
    persist(SECONDARY_STORAGE_KEY, palette);
  }

  window.dispatchEvent(new Event(EVENT));
}

export function useColorValue(variable: string): string {
  return useSyncExternalStore(
    subscribe,
    () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim(),
    () => "",
  );
}
