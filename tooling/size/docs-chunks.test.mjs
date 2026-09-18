import assert from "node:assert/strict";
import test from "node:test";
import {
  checkDocsChunks,
  docsChunkLimits,
  inspectDocsChunks,
} from "./docs-chunks.mjs";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

function fixture() {
  return [
    {
      fileName: "main.js",
      raw: 100,
      isEntry: true,
      imports: [],
      dynamicImports: ["page.js"],
      modules: ["src/main.ts"],
    },
    {
      fileName: "page.js",
      raw: 100,
      imports: [],
      dynamicImports: ["axe-hash.js"],
      modules: ["src/AccessibilityPage.tsx"],
    },
    {
      fileName: "axe-hash.js",
      raw: 586951,
      isDynamicEntry: true,
      imports: [],
      dynamicImports: [],
      modules: [
        "/repo/node_modules/.pnpm/axe-core@4.13.0/node_modules/axe-core/axe.js",
      ],
    },
  ];
}

test("normal and approved lazy axe chunks pass inclusive ceilings", () => {
  const chunks = fixture();
  chunks[0].raw = docsChunkLimits.normal;
  chunks[2].raw = docsChunkLimits.axe;
  assert.deepEqual(checkDocsChunks(chunks).failures, []);
});
for (const [name, mutate, pattern] of [
  [
    "normal overflow",
    (c) => {
      c[0].raw = docsChunkLimits.normal + 1;
    },
    /Normal application chunk exceeds/,
  ],
  [
    "axe overflow",
    (c) => {
      c[2].raw = docsChunkLimits.axe + 1;
    },
    /axe-core lazy tooling.*exceeds/,
  ],
  [
    "axe entry",
    (c) => {
      c[2].isEntry = true;
    },
    /non-initial/,
  ],
  [
    "transitive initial import",
    (c) => {
      c[0].imports = ["page.js"];
      c[1].imports = ["axe-hash.js"];
    },
    /non-initial/,
  ],
  [
    "static import from lazy route",
    (c) => {
      c[1].imports = ["axe-hash.js"];
    },
    /static importers/,
  ],
  [
    "missing dynamic edge",
    (c) => {
      c[1].dynamicImports = [];
    },
    /dynamic import boundary/,
  ],
  [
    "missing dynamic entry",
    (c) => {
      c[2].isDynamicEntry = false;
    },
    /non-initial/,
  ],
  [
    "missing axe",
    (c) => {
      c[2].modules = ["node_modules/axe-core-extra/index.js"];
    },
    /Expected exactly one/,
  ],
  [
    "unrelated vendor included",
    (c) => {
      c[2].modules.push("node_modules/other/index.js");
    },
    /unrelated source/,
  ],
  [
    "missing initial metadata",
    (c) => {
      c[0].isEntry = false;
    },
    /Missing docs entry/,
  ],
]) {
  test(name, () => {
    const chunks = fixture();
    mutate(chunks);
    assert.match(checkDocsChunks(chunks).failures.join("\n"), pattern);
  });
}
test("classification ignores hash, OS path separators and checkout path", () => {
  const chunks = fixture();
  chunks[2].modules = ["C:\\work\\node_modules\\axe-core\\axe.js"];
  chunks[2].fileName = "renamed-123.js";
  chunks[1].dynamicImports = ["renamed-123.js"];
  assert.deepEqual(checkDocsChunks(chunks).failures, []);
  assert.deepEqual(
    checkDocsChunks(chunks).rows,
    checkDocsChunks([...chunks].reverse()).rows,
  );
});
test("disk inspection measures bytes and rejects unaccounted emitted JavaScript", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "flux-docs-chunks-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, ".vite"));
  const chunks = fixture();
  await writeFile(
    join(directory, ".vite/docs-chunks.json"),
    JSON.stringify(chunks),
  );
  for (const chunk of chunks)
    await writeFile(join(directory, chunk.fileName), "é");
  assert.ok(
    (await inspectDocsChunks(directory)).rows.every((row) => row.raw === 2),
  );
  await writeFile(join(directory, "unlisted.js"), "");
  await assert.rejects(inspectDocsChunks(directory), /do not match/);
});

test("normal and full quality builds enforce docs budgets after Vite succeeds", async () => {
  const { commands, taskCommand } = await import("../terminal/commands.mjs");
  assert.deepEqual(commands["build:docs"], [
    ["pnpm", "--filter", "@flux-ui/docs", "build"],
    ["node", "tooling/size/docs-chunks.mjs"],
  ]);
  assert.ok(
    commands.build.some(
      (command) =>
        JSON.stringify(command) === JSON.stringify(taskCommand("build:docs")),
    ),
  );
  assert.ok(
    commands.check.some(
      (command) =>
        JSON.stringify(command) === JSON.stringify(taskCommand("build")),
    ),
  );
  assert.deepEqual(commands["check:full"][0], taskCommand("check"));
});
