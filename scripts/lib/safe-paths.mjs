import { lstat } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

/** Reject symlinks at every level: rm must never traverse a redirected parent. */
export async function confinedPath(root, target) {
  const absolute = resolve(root, target);
  const local = relative(root, absolute);
  if (
    !local ||
    isAbsolute(local) ||
    local === ".." ||
    local.startsWith(`..${sep}`)
  ) {
    throw new Error("Refusing the repository root or an outside path.");
  }
  let cursor = resolve(root);
  for (const part of local.split(sep)) {
    cursor = resolve(cursor, part);
    try {
      if ((await lstat(cursor)).isSymbolicLink()) {
        throw new Error(
          `Refusing a symbolic link in cleanup target: ${cursor}`,
        );
      }
    } catch (error) {
      if (error?.code === "ENOENT") break;
      throw error;
    }
  }
  return absolute;
}

export function isBuildOutput(target) {
  return (
    target === ".cache" ||
    /^(?:packages|apps)\/[A-Za-z0-9_-]+\/dist$/u.test(target)
  );
}
