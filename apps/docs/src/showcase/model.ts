/** URL state is intentionally separate from the docs' saved appearance. */
export const moods = [
  {
    id: "paper",
    label: "Paper",
    description: "Warm canvas. Open spacing. Quiet hierarchy.",
  },
  {
    id: "studio",
    label: "Studio",
    description: "Compact rhythm. Focused surfaces. After dark.",
  },
  {
    id: "bloom",
    label: "Bloom",
    description: "Soft surfaces. Generous controls. Clear hierarchy.",
  },
  {
    id: "terminal",
    label: "Terminal",
    description: "Compact, precise, and deliberately technical.",
  },
] as const;
export type Mood = (typeof moods)[number]["id"];
export function isMood(value: string): value is Mood {
  return moods.some((mood) => mood.id === value);
}
export function readShowcaseRoute(route: string, sceneIds: readonly string[]) {
  const queryIndex = route.indexOf("?");
  const query = new URLSearchParams(
    queryIndex < 0 ? "" : route.slice(queryIndex + 1),
  );
  const requestedScene = query.get("scene") ?? "";
  const requestedMood = query.get("mood") ?? "";
  const scene = sceneIds.includes(requestedScene)
    ? requestedScene
    : (sceneIds[0] ?? "finance");
  const mood: Mood = isMood(requestedMood) ? requestedMood : "paper";
  return { scene, mood };
}
export function showcaseHash(
  page: "overview" | "playground",
  scene: string,
  mood: Mood,
): string {
  return `#${page}?${new URLSearchParams({ scene, mood }).toString()}`;
}
/** Pure helpers keep the demo arithmetic inspectable and deterministic. */
export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
export function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)
    .toString()
    .padStart(2, "0")}:${(whole % 60).toString().padStart(2, "0")}`;
}
