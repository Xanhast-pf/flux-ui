/** Parse repository-local values without executing Git, includes, or shell text.
 * Syntax reference: https://git-scm.com/docs/git-config#_syntax
 * Global/system configuration and include evaluation are deliberately out of scope.
 */
function logicalLines(source) {
  const lines = [];
  let line = "";
  let quoted = false;
  let comment = false;
  for (let i = 0; i < source.length; i++) {
    const character = source[i];
    if (character === "\r" && source[i + 1] === "\n") continue;
    if (!comment && character === "\\") {
      if (source[i + 1] === "\n") {
        i++;
        continue;
      }
      if (source[i + 1] === "\r" && source[i + 2] === "\n") {
        i += 2;
        continue;
      }
      line += character;
      if (i + 1 < source.length) line += source[++i];
      continue;
    }
    if (character === "\n") {
      if (quoted) throw new Error("Unterminated quoted Git config value.");
      lines.push(line);
      line = "";
      comment = false;
      continue;
    }
    if (!comment && character === '"') quoted = !quoted;
    if (!quoted && (character === "#" || character === ";")) comment = true;
    line += character;
  }
  if (quoted) throw new Error("Unterminated quoted Git config value.");
  if (line) lines.push(line);
  return lines;
}

function valueText(raw) {
  let quoted = false;
  let value = "";
  let whitespace = "";
  for (let i = 0; i < raw.length; i++) {
    const character = raw[i];
    if (!quoted && (character === "#" || character === ";")) break;
    if (character === '"') {
      value += whitespace;
      whitespace = "";
      quoted = !quoted;
    } else if (character === "\\") {
      const escapes = { n: "\n", t: "\t", b: "\b", '"': '"', "\\": "\\" };
      const next = raw[++i];
      if (!Object.hasOwn(escapes, next ?? ""))
        throw new Error("Unsupported escape in Git config value.");
      value += whitespace + escapes[next];
      whitespace = "";
    } else if (!quoted && /[ \t]/u.test(character)) {
      if (value) whitespace += character;
    } else {
      value += whitespace + character;
      whitespace = "";
    }
  }
  if (quoted) throw new Error("Unterminated quoted Git config value.");
  return value;
}

export function gitConfigValue(source, section, key) {
  let currentSection = null;
  let value = null;
  for (const rawLine of logicalLines(source)) {
    let line = rawLine.trimStart();
    if (!line || /^[#;]/u.test(line)) continue;
    if (line.startsWith("[")) {
      const header = /^\[([a-z\d.-]+)(?:\s+"(?:[^"\\]|\\.)*")?\]\s*/iu.exec(
        line,
      );
      if (!header)
        throw new Error("Cannot interpret local Git config section.");
      const name = header[1].toLowerCase();
      if (name === "include" || name === "includeif")
        throw new Error(
          "Git config includes require manual effective hooks-path verification.",
        );
      currentSection = header[0].includes('"') ? null : name;
      line = line.slice(header[0].length);
    }
    if (
      !line ||
      /^[#;]/u.test(line) ||
      currentSection !== section.toLowerCase()
    )
      continue;
    const setting = /^([a-z][a-z\d-]*)\s*(?:=(.*)|[#;].*)?$/iu.exec(line);
    if (!setting)
      throw new Error("Cannot interpret local Git config assignment.");
    if (setting[1].toLowerCase() !== key.toLowerCase()) continue;
    value = setting[2] === undefined ? "true" : valueText(setting[2]);
  }
  return value;
}

export function gitBoolean(value) {
  const normalized = value?.toLowerCase();
  if (
    normalized === undefined ||
    normalized === "" ||
    ["false", "no", "off", "0"].includes(normalized)
  )
    return false;
  if (
    ["true", "yes", "on", "1"].includes(normalized) ||
    /^[1-9]\d*$/u.test(normalized)
  )
    return true;
  throw new Error("Cannot interpret extensions.worktreeConfig boolean.");
}
