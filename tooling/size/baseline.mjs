import { open, rename, rm } from "node:fs/promises";
import { bundledEntryMethod } from "./bundled-entry.mjs";
import { regressionFailures } from "./lib.mjs";

export function bundledRegressions(current, previous) {
  if (
    !previous ||
    ["raw", "gzip", "brotli"].some(
      (metric) =>
        !Number.isSafeInteger(previous[metric]) || previous[metric] < 0,
    )
  )
    return [{ metric: "baseline" }];
  return regressionFailures(current, previous);
}

export function bundledBaseline(baseline, measurements) {
  return {
    ...baseline,
    schemaVersion: 2,
    bundledEntryMethod,
    components: Object.fromEntries(
      [
        ...new Set([
          ...Object.keys(baseline.components ?? {}),
          ...Object.keys(measurements),
        ]),
      ]
        .sort()
        .map((slug) => [
          slug,
          {
            ...baseline.components?.[slug],
            ...(measurements[slug] ? { bundled: measurements[slug] } : {}),
          },
        ]),
    ),
  };
}

// Exclusive sibling creation and rename leave the original intact on failure.
export async function writeBaselineAtomic(path, baseline) {
  const temporary = `${path}.pending`;
  const file = await open(temporary, "wx");
  try {
    await file.writeFile(`${JSON.stringify(baseline, null, 2)}\n`, "utf8");
    await file.sync();
    await file.close();
    await rename(temporary, path);
  } finally {
    await file.close();
    await rm(temporary, { force: true });
  }
}
