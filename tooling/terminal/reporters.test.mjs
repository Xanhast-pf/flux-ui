import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import VitestReporter from "./vitest-reporter.mjs";
import BrowserReporter from "./playwright-reporter.mjs";

test("native test reporters preserve semantic items and skipped counts", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "flux-reporter-test-"));
  const previous = {
    progress: process.env.FLUX_PROGRESS_FILE,
    summary: process.env.FLUX_SUMMARY_FILE,
  };
  t.after(async () => {
    for (const [key, value] of [
      ["FLUX_PROGRESS_FILE", previous.progress],
      ["FLUX_SUMMARY_FILE", previous.summary],
    ]) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(directory, { recursive: true, force: true });
  });
  process.env.FLUX_PROGRESS_FILE = join(directory, "progress");
  process.env.FLUX_SUMMARY_FILE = join(directory, "summary");
  const reporter = new VitestReporter();
  reporter.onTestRunStart([{}, {}]);
  reporter.onTestModuleStart({ moduleId: "/fixtures/Example.test.tsx" });
  assert.equal(
    JSON.parse(await readFile(process.env.FLUX_PROGRESS_FILE, "utf8")).item,
    "Example.test.tsx",
  );
  reporter.onTestRunEnd([
    {
      children: {
        allTests: () =>
          ["passed", "skipped", "failed"].map((state) => ({
            result: () => ({ state }),
          })),
      },
    },
  ]);
  assert.match(
    await readFile(process.env.FLUX_SUMMARY_FILE, "utf8"),
    /1 passed · 1 skipped · 1 failed/u,
  );
  const browser = new BrowserReporter();
  browser.onTestBegin({
    location: { file: "/fixtures/example.spec.ts" },
    title: "keyboard navigation",
  });
  assert.equal(
    JSON.parse(await readFile(process.env.FLUX_PROGRESS_FILE, "utf8")).item,
    "browser · example.spec.ts · keyboard navigation",
  );
});

test("browser and performance use discovered cases, counting retries once", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "flux-count-test-"));
  const previous = process.env.FLUX_PROGRESS_FILE;
  process.env.FLUX_PROGRESS_FILE = join(directory, "progress");
  t.after(async () => {
    if (previous === undefined) delete process.env.FLUX_PROGRESS_FILE;
    else process.env.FLUX_PROGRESS_FILE = previous;
    await rm(directory, { recursive: true, force: true });
  });
  const reporter = new BrowserReporter();
  reporter.onBegin({}, { allTests: () => [{}, {}] });
  const fixture = {
    id: "one",
    location: { file: "/tests/perf.spec.ts" },
    title: "button update",
    parent: { project: () => ({ name: "chromium" }) },
  };
  reporter.onTestBegin(fixture);
  let event = JSON.parse(
    await readFile(process.env.FLUX_PROGRESS_FILE, "utf8"),
  );
  assert.equal(event.current, 0);
  assert.equal(event.total, 2);
  assert.match(event.item, /chromium.*button update/u);
  reporter.onTestEnd(fixture);
  reporter.onTestEnd(fixture);
  event = JSON.parse(await readFile(process.env.FLUX_PROGRESS_FILE, "utf8"));
  assert.equal(event.current, 1);
});

test("build boundaries use the declared package total", async () => {
  const { commandProgress } = await import("./commands.mjs");
  assert.deepEqual(
    commandProgress(
      "build:packages",
      ["pnpm", "--filter", "@flux-ui/react", "build"],
      3,
      4,
    ),
    {
      current: 3,
      total: 4,
      unit: "packages",
      item: "--filter @flux-ui/react build",
    },
  );
});
