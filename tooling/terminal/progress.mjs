import { appendFileSync, writeFileSync } from "node:fs";
/** Best-effort side channel; never mixed into machine-readable stdout. */
export function reportProgress(item) {
  if (!process.env.FLUX_PROGRESS_FILE) return;
  try {
    writeFileSync(
      process.env.FLUX_PROGRESS_FILE,
      JSON.stringify(
        typeof item === "string"
          ? { item: item.slice(0, 1024) }
          : { ...item, item: String(item.item || "").slice(0, 1024) },
      ),
    );
  } catch {
    /* Progress must never affect correctness. */
  }
}

export function reportSummary(summary) {
  if (!process.env.FLUX_SUMMARY_FILE) {
    console.error(summary);
    return;
  }
  try {
    appendFileSync(process.env.FLUX_SUMMARY_FILE, `${String(summary)}\n`);
  } catch {
    console.error(summary);
  }
}
