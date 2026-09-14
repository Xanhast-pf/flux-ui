import { Button, Field, Inline, Select, Stack, Text } from "@flux-ui/react";
import { useState } from "react";
import { downloadBytes } from "../lib/download.js";
import { CodeBlock } from "../ui/CodeBlock.js";
import { recipeArchive, type RecipeBundle } from "./recipeArchive.js";
export default function RecipeSource({
  recipe,
  label,
}: {
  recipe: RecipeBundle;
  label: string;
}) {
  const [path, setPath] = useState(recipe.entry);
  const [error, setError] = useState<string | null>(null);
  return (
    <Stack gap="md">
      <Inline wrap gap="md">
        <Field.Root>
          <Field.Label>Recipe file</Field.Label>
          <Field.Control>
            <Select
              value={path}
              onChange={(event) => setPath(event.currentTarget.value)}
            >
              {Object.keys(recipe.files)
                .sort()
                .map((file) => (
                  <option key={file} value={file}>
                    {file}
                  </option>
                ))}
            </Select>
          </Field.Control>
        </Field.Root>
        <Button
          variant="outline"
          onClick={() => {
            try {
              downloadBytes(
                recipeArchive(recipe.files),
                `flux-${recipe.scene}-recipe.zip`,
              );
              setError(null);
            } catch (cause) {
              setError(
                cause instanceof Error
                  ? cause.message
                  : "The source archive could not be created.",
              );
            }
          }}
        >
          Download complete recipe
        </Button>
      </Inline>
      <Text variant="caption" tone="muted">
        {Object.keys(recipe.files).length} files, including helpers, artwork,
        license and consumer setup. Supply the approved Flux package archives as
        described in README.md; this is not a release attestation.
      </Text>
      {error !== null ? (
        <Text role="alert" tone="danger">
          {error}
        </Text>
      ) : null}
      <CodeBlock
        language={
          path.endsWith(".css")
            ? "css"
            : path.endsWith(".json")
              ? "json"
              : path.endsWith(".md")
                ? "markdown"
                : path.endsWith(".html")
                  ? "html"
                  : "tsx"
        }
        code={recipe.files[path] ?? ""}
        label={
          path === recipe.entry
            ? `${label} composition source`
            : `${path} source`
        }
      />
    </Stack>
  );
}
