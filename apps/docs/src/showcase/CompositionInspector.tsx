import {
  Button,
  Card,
  Grid,
  Heading,
  Inline,
  Link,
  Text,
  Stack,
} from "@flux-ui/react";
import { lazy, Suspense, useState } from "react";
import { components } from "../generated/components.js";
import { REPOSITORY_URL } from "../lib/format.js";
import RecipeSource from "./RecipeSource.js";
import { showcaseScenes, type ShowcaseScene } from "./catalog.js";
const sources = new Map(
  showcaseScenes.map((scene) => {
    const Source = lazy(async () => {
      const recipe = await scene.loadRecipe();
      return {
        default: function SceneSource() {
          return <RecipeSource recipe={recipe} label={scene.label} />;
        },
      };
    });
    return [scene.id, <Source />] as const;
  }),
);
export default function CompositionInspector({
  scene,
}: {
  scene: ShowcaseScene;
}) {
  const [source, setSource] = useState(false);
  return (
    <Card aria-label="Composition details" as="section" padding={6}>
      <Grid columns={{ base: 1, md: 2 }} gap="lg">
        <Stack gap="md">
          <Text as="p" variant="eyebrow" tone="muted">
            Built with the real thing
          </Text>
          <Heading level={3} size="md">
            The ingredients, not the illusion.
          </Heading>
          <Inline wrap gap="sm">
            {scene.components.map((slug) => (
              <Link key={slug} href={`#components/${slug}`}>
                {components.find((entry) => entry.slug === slug)?.name ?? slug}{" "}
                ↗
              </Link>
            ))}
          </Inline>
        </Stack>
        <Stack gap="md">
          <Text as="p" variant="eyebrow" tone="muted">
            What is custom here?
          </Text>
          <Text as="p" variant="body">
            {scene.custom}
          </Text>
          <Text as="p" variant="caption" tone="muted">
            Inspect every source file, then export the complete consumer recipe.
            Helpers and approved artwork are included; no private Flux imports
            or hidden docs styling are required. Package archives are supplied
            separately so an unreleased version is never presented as
            installable.
          </Text>
          <Inline wrap gap="sm">
            <Button
              size="sm"
              variant="outline"
              tone="neutral"
              onClick={() => {
                setSource((value) => !value);
              }}
              aria-expanded={source}
            >
              {source ? "Hide source" : "View source"}
            </Button>
            <Link href={`${REPOSITORY_URL}/tree/main/apps/docs/src/showcase`}>
              Browse the showcase source ↗
            </Link>
          </Inline>
        </Stack>
        {source ? (
          <Grid.Item colSpan="full">
            <Suspense
              fallback={
                <Text role="status" as="p" variant="body">
                  Loading source…
                </Text>
              }
            >
              {sources.get(scene.id)}
            </Suspense>
          </Grid.Item>
        ) : null}
      </Grid>
    </Card>
  );
}
