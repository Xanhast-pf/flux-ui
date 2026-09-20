export function portablePathKey(path) {
  return path.normalize("NFC").replaceAll("\\", "/").toLowerCase();
}

export function findPortablePathCollisions(paths) {
  const groups = new Map();
  for (const path of paths) {
    const key = portablePathKey(path);
    const group = groups.get(key) ?? [];
    group.push(path);
    groups.set(key, group);
  }
  return [...groups.values()]
    .filter((group) => new Set(group).size > 1)
    .map((group) => [...new Set(group)].sort())
    .sort((left, right) => left[0].localeCompare(right[0]));
}
