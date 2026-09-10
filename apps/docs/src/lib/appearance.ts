import { useSyncExternalStore } from "react";
export type Theme = "light" | "dark";
export type Accent = "indigo" | "teal" | "rose";
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
function accentSnapshot(): Accent {
  const accent = document.documentElement.dataset.docsAccent;
  return accent === "teal" || accent === "rose" ? accent : "indigo";
}
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, themeSnapshot, () => "light");
}
export function useAccent(): Accent {
  return useSyncExternalStore(subscribe, accentSnapshot, () => "indigo");
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
export function setAccent(accent: Accent): void {
  document.documentElement.dataset.docsAccent = accent;
  persist("flux-ui-docs-accent", accent);
  window.dispatchEvent(new Event(EVENT));
}
export function isAccent(value: string): value is Accent {
  return value === "indigo" || value === "teal" || value === "rose";
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
