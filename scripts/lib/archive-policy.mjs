const noiseDirectories = new Set([
  ".git",
  ".idea",
  ".vscode",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".cache",
  ".turbo",
  ".vite",
  ".next",
  ".pnpm-store",
  "playwright-report",
  "test-results",
  ".aws",
  ".ssh",
  ".gnupg",
  ".azure",
  ".kube",
  ".secrets",
]);
const templates = new Set([".env.example", ".env.sample", ".env.template"]);
export function omitDirectory(path, name) {
  return (
    noiseDirectories.has(name) ||
    name.startsWith(".archive-") ||
    path === ".coding-bible/cache"
  );
}
export function omitFile(name) {
  const lower = name.toLowerCase();
  return (
    [
      ".ds_store",
      "thumbs.db",
      ".netrc",
      "_netrc",
      ".pypirc",
      "credentials",
      "credentials.json",
    ].includes(lower) ||
    /\.(?:log|zip|pem|key|p12|pfx|jks|keystore)$/u.test(lower) ||
    /^id_(?:rsa|dsa|ecdsa|ed25519)(?:$|\.)/u.test(lower) ||
    ((lower === ".env" || lower.startsWith(".env.")) && !templates.has(lower))
  );
}
/** Skip credential-bearing configuration; retain harmless registry configuration. */
export function containsSecret(name, bytes) {
  const text = bytes.toString("utf8");
  if (/^\s*-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----\s*$/mu.test(text))
    return true;
  if (
    !/^(?:\.?npmrc|\.?yarnrc(?:\.yml)?|\.env\.(?:example|sample|template))$/iu.test(
      name,
    )
  )
    return false;
  if (/[a-z]+:\/\/[^\s/:]+:[^\s/@]+@/iu.test(text)) return true;
  return text.split(/\r?\n/u).some((line) => {
    if (/^\s*[#;]/u.test(line)) return false;
    const match =
      /^\s*[^=]*?(?:auth|password|secret|token|api[_-]?key|private[_-]?key|access[_-]?key)[^=]*?\s*[:=]\s*(.+)/iu.exec(
        line,
      );
    if (!match) return false;
    const value = match[1].trim().replace(/^["']|["']$/gu, "");
    return (
      value !== "" &&
      !/^\$\{[A-Z_][A-Z0-9_]*\}$/iu.test(value) &&
      !/^(?:example|changeme|replace[_-]?me|your[_-].*|<[^>]+>)$/iu.test(value)
    );
  });
}
