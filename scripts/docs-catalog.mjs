/** Compare public slugs with convention-based docs filenames, without loading JSX. */
export function validateExampleFiles(slugs, filenames) {
  const errors = [];
  const known = new Set(slugs);
  if (known.size !== slugs.length)
    errors.push("Duplicate public component slug.");
  const expected = new Set(slugs.map((slug) => `${slug}.example.tsx`));
  const actual = new Set(
    filenames.filter((name) => name.endsWith(".example.tsx")),
  );
  for (const name of expected)
    if (!actual.has(name)) errors.push(`Missing docs example: ${name}`);
  for (const name of actual)
    if (!expected.has(name)) errors.push(`Orphan docs example: ${name}`);
  return errors;
}

/** Every showcase is a convention-based metadata/preview pair, not a registry edit. */
export function validateShowcaseFiles(filenames) {
  const errors = [];
  const scenes = filenames.filter((name) => name.endsWith(".scene.ts"));
  const previews = filenames.filter((name) => name.endsWith(".preview.tsx"));
  const files = new Set(filenames);
  if (scenes.length === 0)
    errors.push("At least one showcase scene is required.");
  if (files.size !== filenames.length)
    errors.push("Duplicate showcase filename.");
  for (const name of scenes) {
    if (!/^[a-z]+(?:-[a-z]+)*\.scene\.ts$/u.test(name)) {
      errors.push(`Invalid showcase filename: ${name}`);
      continue;
    }
    const preview = name.replace(/\.scene\.ts$/u, ".preview.tsx");
    if (!files.has(preview))
      errors.push(`Missing showcase preview: ${preview}`);
  }
  for (const name of previews) {
    const definition = name.replace(/\.preview\.tsx$/u, ".scene.ts");
    if (!files.has(definition)) errors.push(`Orphan showcase preview: ${name}`);
  }
  return errors;
}
