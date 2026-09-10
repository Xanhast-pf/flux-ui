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
