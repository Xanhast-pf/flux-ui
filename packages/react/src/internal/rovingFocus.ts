interface RovingOptions {
  orientation: "horizontal" | "vertical";
  direction: "ltr" | "rtl";
  loopFocus: boolean;
}
/** Null means the key belongs to the caller, not this focus collection. */
export function nextRovingIndex(
  key: string,
  current: number,
  count: number,
  options: RovingOptions,
): number | null {
  if (count === 0 || current < 0 || current >= count) return null;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  const horizontal = options.orientation === "horizontal";
  const nextKey = horizontal
    ? options.direction === "rtl"
      ? "ArrowLeft"
      : "ArrowRight"
    : "ArrowDown";
  const previousKey = horizontal
    ? options.direction === "rtl"
      ? "ArrowRight"
      : "ArrowLeft"
    : "ArrowUp";
  if (key !== nextKey && key !== previousKey) return null;
  const next = current + (key === nextKey ? 1 : -1);
  return options.loopFocus
    ? (next + count) % count
    : Math.max(0, Math.min(count - 1, next));
}
