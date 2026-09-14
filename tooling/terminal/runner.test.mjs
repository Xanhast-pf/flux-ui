import assert from "node:assert/strict";
import test from "node:test";
import { Writable } from "node:stream";
import { setTimeout } from "node:timers/promises";
import { runTask } from "./runner.mjs";
import { createProgress } from "./output.mjs";
function capture(tty = false, columns = 80) {
  let text = "";
  const output = new Writable({
    write(chunk, encoding, callback) {
      text += chunk;
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
    { output: sink.output, label: "Example" },
  );
  assert.equal(result.status, 0);
  assert.ok(!sink.text().includes("hidden"));
  assert.ok(!sink.text().includes("\u001b"));
  assert.match(sink.text(), /PASS Example/u);
  assert.match(sink.text(), /warning/u);
});
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

test("semantic updates reach a live task and stop with its completion", async () => {
  const sink = capture(true, 80);
  await runTask(
    [
      "node",
      "-e",
      'require("node:fs").writeFileSync(process.env.FLUX_PROGRESS_FILE,"Example.test.tsx");setTimeout(()=>{},400)',
    ],
    { output: sink.output, label: "Tests" },
  );
  assert.ok(sink.text().includes("Example.test.tsx"));
  const completed = sink.text();
  await setTimeout(150);
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

test("truthful progress, tail truncation, color policy and throttling", async () => {
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
  for (let i = 0; i < 1000; i++)
    progress.update({
      current: 37,
      total: 48,
      unit: "files",
      item: "Tabs.test.tsx",
    });
  assert.equal(sink.text().split("\u001b[2K").length, 2);
  await setTimeout(120);
  assert.match(sink.text(), /37\/48 files/u);
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
