import { stripVTControlCharacters } from "node:util";

export function terminalCapabilities(output, env) {
  return {
    live: Boolean(output.isTTY && !env.CI && env.TERM !== "dumb"),
    color:
      env.NO_COLOR !== undefined
        ? false
        : env.FORCE_COLOR !== undefined
          ? env.FORCE_COLOR !== "0"
          : Boolean(output.isTTY && !env.CI && env.TERM !== "dumb"),
  };
}
const clean = (text) =>
  stripVTControlCharacters(String(text)).replace(/[\r\n\t]/gu, " ");
export function truncate(text, width) {
  const chars = Array.from(clean(text));
  return chars.length <= width
    ? chars.join("")
    : width < 2
      ? "…".slice(0, width)
      : `…${chars.slice(-(width - 1)).join("")}`;
}
export function createProgress(output = process.stdout, env = process.env) {
  const { live, color } = terminalCapabilities(output, env);
  const paint = (text, code) =>
    color ? `\u001b[${code}m${text}\u001b[0m` : text;
  let timer;
  let frame = 0;
  let label = "";
  let event = {};
  let done = false;
  let stopped = false;
  let started;
  function draw() {
    if (done || stopped) return;
    const width = Math.max(1, (output.columns || 80) - 1);
    const determinate =
      Number.isInteger(event.current) &&
      Number.isInteger(event.total) &&
      event.total > 0 &&
      event.current >= 0 &&
      event.current <= event.total;
    const count = determinate
      ? `${event.current}/${event.total}${event.unit ? ` ${event.unit}` : ""}`
      : `${"|/-\\"[frame++ % 4]} ${((performance.now() - started) / 1000).toFixed(1)}s`;
    const barWidth = Math.min(
      20,
      Math.max(0, width - label.length - count.length - 12),
    );
    const filled = determinate
      ? Math.floor((barWidth * event.current) / event.total)
      : 0;
    const bar =
      determinate && barWidth >= 5
        ? ` [${"█".repeat(filled)}${"░".repeat(barWidth - filled)}]`
        : "";
    const prefix = `RUN ${label} ${count}${bar}`;
    const remaining = width - prefix.length - 2;
    const row =
      prefix.length > width
        ? truncate(prefix, width)
        : `${prefix}${event.item && remaining > 0 ? `  ${truncate(event.item, remaining)}` : ""}`;
    output.write(`\r\u001b[2K${paint(row, 36)}`);
  }
  return {
    start(text) {
      if (started !== undefined || done || stopped) return;
      started = performance.now();
      label = clean(text);
      if (live) {
        draw();
        timer = setInterval(draw, 100);
      } else output.write(`RUN ${label}\n`);
    },
    update(value) {
      if (done || stopped) return;
      const next = typeof value === "string" ? { item: clean(value) } : value;
      const itemChanged = next.item !== event.item;
      event = next;
      if (live && started !== undefined && itemChanged) draw();
    },
    stop() {
      stopped = true;
      clearInterval(timer);
    },
    finish(text) {
      if (done) return;
      done = true;
      clearInterval(timer);
      if (live) output.write("\r\u001b[2K");
      const value = clean(text);
      const code = value.startsWith("FAIL")
        ? 31
        : value.startsWith("WARN")
          ? 33
          : 32;
      output.write(`${paint(value, code)}\n`);
    },
  };
}
