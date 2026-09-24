import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const palettePresets = [
  {
    id: "slate",
    label: "Graphite",
    description: "Neutral graphite surfaces with a precise monochrome accent.",
  },
  {
    id: "indigo",
    label: "Indigo",
    description: "The Flux default: cool indigo with crisp blue-violet energy.",
  },
  {
    id: "blue",
    label: "Cobalt",
    description:
      "Clear blue surfaces tuned for product and data-heavy interfaces.",
  },
  {
    id: "cyan",
    label: "Arctic",
    description: "Bright cyan energy over cool, airy surfaces.",
  },
  {
    id: "teal",
    label: "Lagoon",
    description: "A restrained teal palette with calm aquatic contrast.",
  },
  {
    id: "emerald",
    label: "Grove",
    description: "Deep emerald accents with quiet botanical surfaces.",
  },
  {
    id: "green",
    label: "Meadow",
    description: "Fresh green with balanced neutral text and status colors.",
  },
  {
    id: "lime",
    label: "Citrus",
    description: "A sharper lime accent grounded by dark readable neutrals.",
  },
  {
    id: "amber",
    label: "Amber",
    description: "Warm gold surfaces with a richer, editorial accent.",
  },
  {
    id: "orange",
    label: "Ember",
    description: "Warm orange energy without sacrificing semantic contrast.",
  },
  {
    id: "rose",
    label: "Rose",
    description: "A composed rose palette with soft pink surfaces.",
  },
  {
    id: "violet",
    label: "Violet",
    description: "Deep violet accents with cool, expressive surfaces.",
  },
  {
    id: "fuchsia",
    label: "Fuchsia",
    description: "High-character magenta balanced by restrained neutral text.",
  },
] as const;

export type PalettePreset = (typeof palettePresets)[number]["id"];

const EVENT = "flux-docs-appearance";

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

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, themeSnapshot, () => "light");
}

export function usePalettePreset(): PalettePreset {
  return useSyncExternalStore(subscribe, paletteSnapshot, () => "indigo");
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
  document.documentElement.dataset.fluxPalette = palette;
  persist("flux-ui-docs-palette", palette);
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
