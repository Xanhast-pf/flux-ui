import assert from "node:assert/strict";
import test from "node:test";
import { Writable } from "node:stream";
import { mkdtemp, rm } from "node:fs/promises";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout } from "node:timers/promises";
import { runTask } from "./runner.mjs";
import { createProgress } from "./output.mjs";
function capture(tty = false, columns = 80, onWrite = () => {}) {
  let text = "";
  const output = new Writable({
    write(chunk, encoding, callback) {
      text += chunk;
      onWrite(String(chunk));
      callback();
    },
  });
  output.isTTY = tty;
  output.columns = columns;
  return { output, text: () => text };
}
test("successful output is captured, warnings retained, non-TTY is plain", async () => {
  const sink = capture();
  const result = await runTask(
    ["node", "-e", 'console.log("hidden"); console.error("warning")'],
    {
      output: sink.output,
      label: "Example",
      env: { ...process.env, FORCE_COLOR: undefined, NO_COLOR: undefined },
    },
  );
  assert.equal(result.status, 0);
  assert.ok(!sink.text().includes("hidden"));
  assert.ok(!sink.text().includes("\u001b"));
  assert.match(sink.text(), /PASS Example/u);
  assert.match(sink.text(), /warning/u);
});
for (const noColor of [undefined, ""]) {
  test(`non-TTY forced color ${noColor === undefined ? "colors summaries without cursor control" : "respects NO_COLOR"}`, async () => {
    const sink = capture();
    const result = await runTask(["node", "-e", 'console.error("warning")'], {
      output: sink.output,
      label: "Example",
      env: { ...process.env, FORCE_COLOR: "1", NO_COLOR: noColor },
    });
    assert.equal(result.status, 0);
    assert.match(sink.text(), /PASS Example/u);
    assert.match(sink.text(), /warning/u);
    if (noColor === undefined) {
      assert.ok(sink.text().includes("\u001b[32mPASS Example"));
      assert.ok(sink.text().includes("\u001b[33mWARN"));
      assert.ok(!sink.text().includes("\u001b[2K"));
      assert.ok(!sink.text().includes("\r"));
    } else {
      assert.ok(!sink.text().includes("\u001b"));
    }
  });
}
test("failure preserves stdout, stderr and actual exit status", async () => {
  const sink = capture();
  const result = await runTask(
    [
      "node",
      "-e",
      'console.log("diagnostic"); console.error("error"); process.exitCode=7',
    ],
    { output: sink.output },
  );
  assert.equal(result.status, 7);
  assert.match(sink.text(), /diagnostic/u);
  assert.match(sink.text(), /error/u);
  assert.match(sink.text(), /Exit code: 7/u);
});
test("TTY clips long items, NO_COLOR needs no color, stops rendering on completion", async () => {
  const sink = capture(true, 12);
  const progress = createProgress(sink.output, { NO_COLOR: "1" });
  progress.start("a".repeat(100));
  progress.update("current file".repeat(100));
  await setTimeout(120);
  progress.finish("PASS");
  const completed = sink.text();
  await setTimeout(120);
  assert.equal(sink.text(), completed);
  assert.ok(completed.includes("\u001b[2K"));
  assert.ok(!completed.includes("\u001b[31m"));
  assert.ok(completed.split("\u001b[2K").every((line) => line.length <= 12));
});
test("CI disables cursor control even with a TTY", () => {
  const sink = capture(true);
  const progress = createProgress(sink.output, { CI: "true" });
  progress.start("Example");
  progress.finish("PASS");
  assert.ok(!sink.text().includes("\u001b"));
});
test("SIGINT is forwarded and returns 130", async () => {
  const sink = capture();
  const pending = runTask(["node", "-e", "setInterval(()=>{},100)"], {
    output: sink.output,
  });
  await setTimeout(250);
  process.emit("SIGINT");
  assert.equal((await pending).status, 130);
});

test("semantic updates reach a live task and stop with its completion", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "flux-live-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const acknowledgement = join(directory, "rendered");
  let rendered = false;
  const sink = capture(true, 80, (chunk) => {
    if (chunk.includes("Example.test.tsx")) {
      assert.ok(!sink.text().includes("PASS Tests"));
      rendered = true;
      writeFileSync(acknowledgement, "");
    }
  });
  const result = await runTask(
    [
      "node",
      "-e",
      `const fs = require("node:fs");
       const watcher = fs.watch(${JSON.stringify(directory)}, () => {
         if (fs.existsSync(${JSON.stringify(acknowledgement)})) watcher.close();
       });
       fs.writeFileSync(process.env.FLUX_PROGRESS_FILE, "Example.test.tsx");`,
    ],
    {
      output: sink.output,
      label: "Tests",
      env: { ...process.env, CI: "", TERM: "xterm" },
    },
  );
  assert.equal(result.status, 0);
  assert.ok(rendered);
  assert.ok(sink.text().includes("Example.test.tsx"));
  const completed = sink.text();
  // Yield once after completion; scheduled renderer work is covered below.
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(sink.text(), completed);
});

test("semantic items render before the next tick and completion cancels pending progress", (t) => {
  t.mock.timers.enable({ apis: ["setInterval"] });
  const sink = capture(true);
  const progress = createProgress(sink.output, {});
  progress.start("Tests");
  progress.update({ item: "First.test.tsx", current: 0, total: 1000 });
  t.mock.timers.tick(99);
  progress.update({ item: "Example.test.tsx", current: 1, total: 1000 });
  assert.ok(sink.text().includes("Example.test.tsx"));
  const active = sink.text();
  for (let current = 2; current <= 1000; current++)
    progress.update({ item: "Example.test.tsx", current, total: 1000 });
  assert.equal(sink.text(), active);
  progress.stop();
  t.mock.timers.tick(1000);
  progress.update("late read before summary");
  assert.equal(sink.text(), active);
  progress.finish("PASS Tests");
  const completed = sink.text();
  t.mock.timers.tick(1000);
  progress.update("late item");
  progress.finish("duplicate");
  assert.equal(sink.text(), completed);
});

test("raw machine output receives no terminal rows", async (t) => {
  const { mkdtemp, open, readFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const directory = await mkdtemp(join(tmpdir(), "flux-machine-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, "result.json");
  const file = await open(path, "w");
  const sink = capture();
  const result = await runTask(
    ["node", "-e", "console.log(JSON.stringify({ok:true}))"],
    { raw: true, stdout: file.fd, output: sink.output },
  );
  await file.close();
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(await readFile(path, "utf8")), { ok: true });
  assert.equal(sink.text(), "");
});

test("repeated tasks do not accumulate output listeners", async () => {
  const sink = capture();
  const before = sink.output
    .eventNames()
    .map((name) => [name, sink.output.listenerCount(name)]);
  for (let index = 0; index < 12; index++)
    await runTask(["node", "-e", ""], { output: sink.output });
  assert.deepEqual(
    sink.output
      .eventNames()
      .map((name) => [name, sink.output.listenerCount(name)]),
    before,
  );
});

test("truthful progress, tail truncation, color policy and throttling", async (t) => {
  t.mock.timers.enable({ apis: ["setInterval"] });
  const { terminalCapabilities, truncate } = await import("./output.mjs");
  assert.equal(
    terminalCapabilities({ isTTY: false }, { FORCE_COLOR: "1" }).color,
    true,
  );
  assert.equal(
    terminalCapabilities({ isTTY: true }, { NO_COLOR: "", FORCE_COLOR: "1" })
      .color,
    false,
  );
  assert.equal(
    truncate("packages/components/Tabs.test.tsx", 14),
    "…Tabs.test.tsx".slice(-14),
  );
  const sink = capture(true, 100);
  const progress = createProgress(sink.output, {});
  progress.start("Tests");
  progress.update({
    item: "Tabs.test.tsx",
    current: 0,
    total: 1000,
    unit: "files",
  });
  const initial = sink.text();
  for (let i = 1; i <= 1000; i++)
    progress.update({
      current: i,
      total: 1000,
      unit: "files",
      item: "Tabs.test.tsx",
    });
  assert.equal(sink.text(), initial);
  t.mock.timers.tick(99);
  assert.equal(sink.text(), initial);
  t.mock.timers.tick(1);
  assert.equal(sink.text().split("\u001b[2K").length, 4);
  assert.match(sink.text(), /1000\/1000 files/u);
  assert.match(sink.text(), /Tabs.test.tsx/u);
  assert.match(sink.text(), /█/u);
  assert.ok(sink.text().includes("\u001b[36m"));
  progress.finish("PASS Tests");
  assert.ok(sink.text().includes("\u001b[32m"));
  const finished = sink.text();
  progress.update("late");
  progress.finish("duplicate");
  assert.equal(sink.text(), finished);
});

for (const raw of [false, true]) {
  for (const preference of [
    {},
    { NO_COLOR: "" },
    { FORCE_COLOR: "2" },
    { CI: "true", FORCE_COLOR: "1" },
  ]) {
    test(`child color environment raw=${raw} ${JSON.stringify(preference)}`, async (t) => {
      const { readFile } = await import("node:fs/promises");
      const directory = await mkdtemp(join(tmpdir(), "flux-color-test-"));
      t.after(() => rm(directory, { recursive: true, force: true }));
      const path = join(directory, "environment.json");
      const env = { ...process.env, ...preference };
      for (const key of ["NO_COLOR", "FORCE_COLOR", "CI"])
        if (!Object.hasOwn(preference, key)) delete env[key];
      const original = { ...env };
      const result = await runTask(
        [
          process.execPath,
          "-e",
          'require("node:fs").writeFileSync(process.argv[1], JSON.stringify(process.env))',
          path,
        ],
        { raw, env, output: capture().output },
      );
      assert.equal(result.status, 0);
      const actual = JSON.parse(await readFile(path, "utf8"));
      assert.equal(actual.NO_COLOR, raw ? preference.NO_COLOR : "1");
      assert.equal(actual.FORCE_COLOR, raw ? preference.FORCE_COLOR : "0");
      assert.equal(actual.CI, preference.CI);
      assert.equal(actual.FLUX_TERMINAL_ACTIVE, "1");
      assert.deepEqual(env, original);
    });
  }
}
