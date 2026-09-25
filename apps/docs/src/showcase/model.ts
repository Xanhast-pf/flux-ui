/** URL state is intentionally separate from the docs' saved appearance. */
export function readShowcaseRoute(route: string, sceneIds: readonly string[]) {
  const queryIndex = route.indexOf("?");
  const query = new URLSearchParams(
    queryIndex < 0 ? "" : route.slice(queryIndex + 1),
  );
  const requestedScene = query.get("scene") ?? "";
  const scene = sceneIds.includes(requestedScene)
    ? requestedScene
    : (sceneIds[0] ?? "finance");
  return { scene };
}

export function showcaseHash(
  page: "overview" | "playground",
  scene: string,
): string {
  return `#${page}?${new URLSearchParams({ scene }).toString()}`;
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
