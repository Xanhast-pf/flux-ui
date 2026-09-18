import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { formatBytes } from "./lib.mjs";

// Decimal kB preserves Vite's existing 500 kB protection (stricter than 500 KiB).
export const docsChunkLimits = { normal: 500_000, axe: 600_000 };
// axe-core 4.13.0 emits 586,951 bytes: 13,049 bytes (2.22%) deliberate headroom.
const isAxe = (id) =>
  /(?:^|\/)node_modules\/axe-core\//u.test(id.replaceAll("\\", "/"));

export function checkDocsChunks(chunks) {
  const failures = [];
  const byName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
  const initial = new Set();
  function visit(name) {
    if (initial.has(name)) return;
    initial.add(name);
    for (const dependency of byName.get(name)?.imports ?? []) visit(dependency);
  }
  const entries = chunks.filter((chunk) => chunk.isEntry);
  if (!entries.length) failures.push("Missing docs entry chunk metadata.");
  for (const entry of entries) visit(entry.fileName);
  const axeChunks = chunks.filter((chunk) => chunk.modules.some(isAxe));
  if (axeChunks.length !== 1)
    failures.push(
      `Expected exactly one separate axe-core chunk; found ${axeChunks.length}.`,
    );
  const rows = chunks.map((chunk) => {
    const axe = chunk.modules.some(isAxe);
    const limit = axe ? docsChunkLimits.axe : docsChunkLimits.normal;
    const issues = [];
    if (!Number.isSafeInteger(chunk.raw) || chunk.raw < 0 || chunk.raw > limit)
      issues.push(
        `${axe ? "axe-core lazy tooling" : "Normal application chunk"} exceeds ${limit} raw bytes.`,
      );
    if (axe) {
      if (chunk.modules.some((id) => !isAxe(id)))
        issues.push(
          "The axe exception cannot include unrelated source modules.",
        );
      if (initial.has(chunk.fileName) || chunk.isEntry || !chunk.isDynamicEntry)
        issues.push("axe-core must remain a non-initial dynamic chunk.");
      if (chunks.some((other) => other.imports.includes(chunk.fileName)))
        issues.push(
          "axe-core must not have static importers, including lazy routes.",
        );
      if (
        !chunks.some((other) => other.dynamicImports.includes(chunk.fileName))
      )
        issues.push("axe-core must have an emitted dynamic import boundary.");
    }
    for (const issue of issues) failures.push(`${chunk.fileName}: ${issue}`);
    return {
      fileName: chunk.fileName,
      raw: chunk.raw,
      limit,
      axe,
      passed: !issues.length,
    };
  });
  rows.sort((a, b) => a.fileName.localeCompare(b.fileName));
  return { rows, failures };
}

export async function inspectDocsChunks(directory) {
  const chunks = JSON.parse(
    await readFile(resolve(directory, ".vite/docs-chunks.json"), "utf8"),
  );
  // Compare the actual emitted assets with metadata, rather than trusting recorded sizes.
  const files = (await readdir(directory, { recursive: true }))
    .map((file) => file.replaceAll("\\", "/"))
    .filter((file) => /\.(?:m?js|cjs)$/u.test(file));
  const names = chunks.map((chunk) => chunk.fileName);
  if (
    new Set(names).size !== names.length ||
    files.length !== names.length ||
    files.some((file) => !names.includes(file))
  )
    throw new Error(
      "Docs JavaScript assets and chunk metadata do not match. Rebuild docs.",
    );
  for (const chunk of chunks) {
    chunk.raw = (await readFile(resolve(directory, chunk.fileName))).byteLength;
    for (const dependency of [...chunk.imports, ...chunk.dynamicImports])
      if (!names.includes(dependency))
        throw new Error(`Missing chunk metadata for ${dependency}.`);
  }
  return checkDocsChunks(chunks);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const result = await inspectDocsChunks(
    fileURLToPath(new URL("../../apps/docs/dist/", import.meta.url)),
  );
  console.log("Docs chunk budget");
  for (const row of result.rows)
    console.log(
      `${row.passed ? "PASS" : "FAIL"} ${row.fileName}  ${formatBytes(row.raw)} / ${formatBytes(row.limit)}${row.axe ? " · approved lazy axe-core tooling" : ""}`,
    );
  for (const failure of result.failures) console.error(`FAIL ${failure}`);
  if (result.failures.length) process.exitCode = 1;
}
