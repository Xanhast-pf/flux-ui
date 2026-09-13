import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createEvidence, digest, sourceContext } from "./evidence.mjs";

import { validateReport } from "./reports.mjs";

const requireCI = process.argv.includes("--require-ci");
const source = sourceContext();
const receipts = {};
const files = [];
const payloads = [];
for (const job of ["quality", "browser"]) {
  const bytes = await readFile(resolve(".cache/trust", job, "receipt.json"));
  receipts[job] = JSON.parse(bytes.toString("utf8"));
  payloads.push({ name: `${job}.json`, bytes });
}
for (const [job, name] of [
  ["quality", "size.json"],
  ["browser", "runtime.json"],
  ["browser", "browser-tests.json"],
  ["browser", "consumer-tests.json"],
]) {
  const bytes = await readFile(resolve(".cache/trust", job, name));
  validateReport(name, JSON.parse(bytes.toString("utf8")), source);
  payloads.push({ name, bytes });
}
for (const { name, bytes } of payloads)
  files.push({ name, sha256: digest(bytes), bytes: bytes.length });
const evidence = createEvidence(receipts, source, files, requireCI);
const output = resolve("apps/docs/public/evidence");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const { name, bytes } of payloads)
  await writeFile(resolve(output, name), bytes);
await writeFile(
  resolve(output, "index.json"),
  `${JSON.stringify(evidence, null, 2)}\n`,
);
console.log(
  `Generated ${source.kind} evidence for ${source.commit ?? "local source"}: ${evidence.status}.`,
);
