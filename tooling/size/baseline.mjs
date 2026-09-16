import ts from "typescript";
import { format } from "prettier";
import { isDeepStrictEqual } from "node:util";
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

// Targeted acceptance cannot migrate shared metadata for unreviewed entries.
export function targetedBaseline(baseline, measurements) {
  if (
    baseline.schemaVersion !== 2 ||
    !isDeepStrictEqual(baseline.bundledEntryMethod, bundledEntryMethod)
  )
    throw new Error(
      "Targeted acceptance requires schema 2 and the current bundled-entry method; review metadata migration separately.",
    );
  const components = { ...baseline.components };
  for (const slug of Object.keys(measurements).sort()) {
    components[slug] = { ...components[slug], bundled: measurements[slug] };
  }
  return { ...baseline, components };
}

// Replace only selected JSON values so unrelated whitespace is preserved too.
export async function targetedBaselineText(source, measurements) {
  const baseline = JSON.parse(source);
  const proposal = targetedBaseline(baseline, measurements);
  const document = ts.parseJsonText("baseline.json", source);
  const object = document.statements[0]?.expression;
  const property = (node, name) =>
    node?.properties?.find((entry) => entry.name?.text === name);
  const components = property(object, "components")?.initializer;
  const edits = [];
  for (const slug of Object.keys(measurements).sort()) {
    const component = property(components, slug)?.initializer;
    if (!component)
      throw new Error(
        `Targeted acceptance requires an existing component baseline: ${slug}`,
      );
    const bundled = property(component, "bundled")?.initializer;
    if (!bundled)
      throw new Error(
        `Targeted acceptance requires an existing bundled baseline: ${slug}`,
      );
    const start = bundled.getStart(document);
    const indent = source
      .slice(source.lastIndexOf("\n", start) + 1, start)
      .match(/^\s*/u)[0];
    const formatted = await format(
      JSON.stringify(measurements[slug], null, 2),
      {
        parser: "json",
      },
    );
    edits.push({
      start,
      end: bundled.end,
      text: formatted.trimEnd().replaceAll("\n", `\n${indent}`),
    });
  }
  let result = source;
  for (const edit of edits.sort((a, b) => b.start - a.start))
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  if (!isDeepStrictEqual(JSON.parse(result), proposal))
    throw new Error(
      "Targeted baseline text does not match the reviewed proposal.",
    );
  return result;
}

// Exclusive sibling creation and rename leave the original intact on failure.
export async function writeBaselineAtomic(path, baseline) {
  const temporary = `${path}.pending`;
  const file = await open(temporary, "wx");
  try {
    await file.writeFile(
      typeof baseline === "string"
        ? baseline
        : `${JSON.stringify(baseline, null, 2)}\n`,
      "utf8",
    );
    await file.sync();
    await file.close();
    await rename(temporary, path);
  } finally {
    await file.close();
    await rm(temporary, { force: true });
  }
}
