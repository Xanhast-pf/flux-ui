import { spawn } from "node:child_process";
import { mkdtemp, open, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { constants, tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import { stripVTControlCharacters } from "node:util";
import { createProgress } from "./output.mjs";

async function replay(path, output) {
  for await (const chunk of createReadStream(path, { encoding: "utf8" })) {
    if (!output.write(stripVTControlCharacters(chunk.toString())))
      await once(output, "drain");
  }
}

export async function runTask(
  command,
  {
    label = command.join(" "),
    cwd = process.cwd(),
    output = process.stdout,
    env = process.env,
    raw = false,
    stdout = "inherit",
  } = {},
) {
  const directory = await mkdtemp(join(tmpdir(), "flux-terminal-"));
  const log = join(directory, "output.log");
  const warnings = join(directory, "stderr.log");
  const summaryFile = join(directory, "summary");
  await writeFile(summaryFile, "");
  const progressFile = env.FLUX_PROGRESS_FILE || join(directory, "progress");
  const handles = await Promise.all([open(log, "w"), open(warnings, "w")]);
  const progress = raw
    ? { start() {}, update() {}, finish() {} }
    : createProgress(output, env);
  const started = performance.now();
  const elapsed = () => `${((performance.now() - started) / 1000).toFixed(1)}s`;
  progress.start(label);
  const [program, ...args] = command;
  const entry = program === "pnpm" ? env.npm_execpath : undefined;
  const child = spawn(
    entry || program === "node" ? process.execPath : program,
    entry ? [entry, ...args] : args,
    {
      cwd,
      env: {
        ...env,
        NO_COLOR: "1",
        FORCE_COLOR: "0",
        FLUX_TERMINAL_ACTIVE: "1",
        FLUX_SUMMARY_FILE: raw ? env.FLUX_SUMMARY_FILE : summaryFile,
        FLUX_PROGRESS_FILE: raw ? env.FLUX_PROGRESS_FILE : progressFile,
      },
      stdio: raw
        ? ["inherit", stdout, "inherit"]
        : ["inherit", handles[0].fd, handles[1].fd],
      detached: process.platform !== "win32" && !env.FLUX_TERMINAL_ACTIVE,
    },
  );
  let interrupted;
  let escalation;
  function kill(signal) {
    if (!child.pid) return;
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      }).on("error", () => child.kill(signal));
    } else if (env.FLUX_TERMINAL_ACTIVE) {
      child.kill(signal);
    } else {
      try {
        process.kill(-child.pid, signal);
      } catch (error) {
        if (error.code !== "ESRCH") child.kill(signal);
      }
    }
  }
  const interrupt = (signal) => {
    interrupted = signal;
    kill(signal);
    escalation ??= setTimeout(() => kill("SIGKILL"), 2000);
  };
  const onInt = () => interrupt("SIGINT");
  const onTerm = () => interrupt("SIGTERM");
  process.on("SIGINT", onInt);
  process.on("SIGTERM", onTerm);
  const timer = setInterval(async () => {
    const item = await readFile(progressFile, "utf8").catch(() => "");
    try {
      progress.update(JSON.parse(item));
    } catch {
      progress.update(item);
    }
  }, 150);
  const result = await new Promise((resolve) => {
    child.once("error", (error) => resolve({ status: 1, error }));
    child.once("close", (status, signal) => resolve({ status, signal }));
  });
  if (interrupted) kill("SIGKILL");
  clearInterval(timer);
  clearTimeout(escalation);
  process.off("SIGINT", onInt);
  process.off("SIGTERM", onTerm);
  await Promise.all(handles.map((handle) => handle.close()));
  result.signal = interrupted || result.signal;
  if (result.signal)
    result.status = 128 + (constants.signals[result.signal] || 1);
  const passed = result.status === 0 && !result.error && !result.signal;
  const summarySize = (await stat(summaryFile)).size;
  const summary =
    summarySize > 0 && summarySize <= 4096
      ? (await readFile(summaryFile, "utf8")).trim()
      : "";
  const inlineSummary = passed && summary && !summary.includes("\n");
  progress.finish(
    `${passed ? "PASS" : "FAIL"} ${label}  ${inlineSummary ? `${summary} · ` : ""}${elapsed()}`,
  );
  // Stream from disk: output size never determines memory consumption.
  if (!passed && !raw) {
    output.write(
      `\n${label} failed\nCommand: ${command.join(" ")}\nExit code: ${result.status}\n${result.error?.message || ""}\n`,
    );
    await replay(log, output);
  }
  if (!inlineSummary)
    await replay(
      summaryFile,
      output === process.stdout ? process.stderr : output,
    );
  if (passed && (await stat(warnings)).size > 0) {
    createProgress(output, env).finish(
      "WARN Subprocess stderr (preserved in full)",
    );
  }
  await replay(warnings, output === process.stdout ? process.stderr : output);
  await rm(directory, { recursive: true, force: true });
  return result;
}
