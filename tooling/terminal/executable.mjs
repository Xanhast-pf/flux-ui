// Windows batch files require cmd.exe. Quote the native argv, then protect its
// metacharacters from cmd parsing; no caller text is used as a shell command.
// Algorithm reference: https://github.com/moxystudio/node-cross-spawn/blob/master/lib/util/escape.js
function batchArgument(value) {
  if (/[\r\n\0]/u.test(value))
    throw new Error("Command arguments cannot contain line breaks or NUL.");
  let quoted = '"';
  let slashes = 0;
  for (const character of value) {
    if (character === "\\") {
      slashes++;
      continue;
    }
    quoted +=
      "\\".repeat(character === '"' ? slashes * 2 + 1 : slashes) + character;
    slashes = 0;
  }
  quoted += "\\".repeat(slashes * 2) + '"';
  return quoted.replace(/[()[\]%!^"`<>&|;, *?]/gu, "^$&");
}

// Command selection is intentionally independent of process.env. Callers pass
// argv only; environment values are forwarded to the child process separately.
export function executableCommand(command, platform = process.platform) {
  const [program, ...args] = command;
  if (program === "node") return [process.execPath, args, {}];
  if (platform === "win32" && program === "pnpm") {
    return [
      "cmd.exe",
      ["/d", "/s", "/c", `"pnpm.cmd ${args.map(batchArgument).join(" ")}"`],
      { windowsVerbatimArguments: true },
    ];
  }
  return [program, args, {}];
}
