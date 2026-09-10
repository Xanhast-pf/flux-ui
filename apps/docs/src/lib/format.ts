export const REPOSITORY_URL = "https://github.com/Xanhast-pf/flux-ui";
export const MAX_PERF_RATIO_METER = 3;
export function formatBytes(bytes: number | null): string {
  if (bytes === null) return "Pending baseline";
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KiB`;
}
export function budgetUsage(
  brotli: number | null,
  budget: number,
): number | null {
  return brotli === null ? null : brotli / budget;
}
export function formatMs(value: number): string {
  return `${value.toFixed(2)} ms`;
}
export function formatRatio(value: number): string {
  const percent = (value - 1) * 100;
  return `${value.toFixed(2)}× (${percent > 0 ? "+" : ""}${percent.toFixed(1)}%)`;
}
