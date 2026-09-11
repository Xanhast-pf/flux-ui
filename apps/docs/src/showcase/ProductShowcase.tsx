import { CodeIcon, LinkIcon, RefreshIcon } from "@flux-ui/icons";
import {
  Box,
  Button,
  ColorSwatch,
  Grid,
  Heading,
  Inline,
  Link,
  Spinner,
  Stack,
  Tabs,
  Text,
  ThemeScope,
  ToggleGroup,
} from "@flux-ui/react";
import "@flux-ui/tokens/presets.css";
import { lazy, Suspense, useId, useState } from "react";
import { useRoute } from "../lib/routing.js";
import { ExampleBoundary } from "../ui/ExampleBoundary.js";
import { showcaseScenes } from "./catalog.js";
import { isMood, moods, readShowcaseRoute, showcaseHash } from "./model.js";
import "./showcase.css";
const CompositionInspector = lazy(() => import("./CompositionInspector.js"));
const moodColors = {
  paper: "#f1eee4",
  studio: "#383044",
  bloom: "#f0c8dc",
  terminal: "#173523",
} as const;
const sceneIds = showcaseScenes.map((scene) => scene.id);
// Stable element identities let a mood update change CSS without rebuilding a scene.
const views = new Map(
  showcaseScenes.map((scene) => [scene.id, <scene.Preview />] as const),
);
export function ProductShowcase({ page }: { page: "overview" | "playground" }) {
  const route = useRoute();
  const selection = readShowcaseRoute(route, sceneIds);
  const active = showcaseScenes.find((scene) => scene.id === selection.scene);
  const [revision, setRevision] = useState(0);
  const [inspect, setInspect] = useState(false);
  const [copyResult, setCopyResult] = useState<{
    hash: string;
    success: boolean;
  } | null>(null);
  const id = useId();
  if (active === undefined)
    throw new Error("A valid showcase scene is required.");
  const shareHash = showcaseHash("playground", active.id, selection.mood);
  const copyMessage =
    copyResult?.hash === shareHash
      ? copyResult.success
        ? "Scene link copied."
        : "Clipboard unavailable. Use the scene permalink."
      : "";
  async function copyLink(): Promise<void> {
    const url = new URL(window.location.href);
    url.hash = shareHash;
    try {
      await navigator.clipboard.writeText(url.href);
      setCopyResult({ hash: shareHash, success: true });
    } catch {
      setCopyResult({ hash: shareHash, success: false });
    }
  }
  return (
    <Stack
      aria-label="Interactive product showcase"
      className="product-showcase"
      as="section"
      gap="lg"
    >
      <Tabs.Root
        size="sm"
        appearance="pill"
        value={active.id}
        onValueChange={(value) => {
          if (sceneIds.includes(value))
            window.location.hash = showcaseHash(page, value, selection.mood);
        }}
      >
        <Inline
          className="world-controls"
          justify="between"
          align="end"
          wrap
          gap="lg"
          paddingBlock={5}
        >
          <Stack gap={3}>
            <Text variant="caption" tone="muted">
              Choose a world
            </Text>
            <Tabs.List wrap aria-label="Product worlds">
              {showcaseScenes.map((scene) => (
                <Tabs.Tab key={scene.id} value={scene.id}>
                  <scene.Icon size={18} />
                  <Text>{scene.label}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Stack>
          <Stack gap={3}>
            <Text id={`${id}-moods`} variant="caption" tone="muted">
              Set the mood
            </Text>
            <ToggleGroup.Root
              type="single"
              value={selection.mood}
              onValueChange={(value) => {
                if (value !== null && isMood(value))
                  window.location.hash = showcaseHash(page, active.id, value);
              }}
              aria-labelledby={`${id}-moods`}
              size="sm"
              appearance="quiet"
            >
              {moods.map((mood) => (
                <ToggleGroup.Item
                  key={mood.id}
                  value={mood.id}
                  title={mood.description}
                >
                  <ColorSwatch
                    color={moodColors[mood.id]}
                    selected={mood.id === selection.mood}
                    size="sm"
                  />
                  {mood.label}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </Stack>
        </Inline>
        <Grid
          templateColumns={{
            base: "minmax(0, 1fr)",
            md: "minmax(0, 1fr) minmax(0, 24rem)",
          }}
          align="end"
          gap="xl"
          paddingBlock="xl"
        >
          <Box>
            <Text as="p" variant="eyebrow" tone="muted">
              {String(active.order + 1).padStart(2, "0")} / {active.label}
            </Text>
            <Heading level={2} size="lg">
              {active.headline}
            </Heading>
          </Box>
          <Text as="p" variant="body">
            {active.description}
          </Text>
        </Grid>
        {showcaseScenes.map((scene) => (
          <Tabs.Panel key={scene.id} value={scene.id} padding="none">
            {active.id === scene.id ? (
              <ThemeScope
                theme={selection.mood}
                data-mood={selection.mood}
                query
                border="all"
                radius="md"
                surface="canvas"
                className="world-surface"
              >
                <ExampleBoundary key={`${scene.id}-${revision}`}>
                  <Suspense
                    fallback={
                      <Stack
                        align="center"
                        gap="md"
                        role="status"
                        className="scene-loading"
                      >
                        <Spinner aria-hidden="true" />
                        Opening {scene.brand}…
                      </Stack>
                    }
                  >
                    {views.get(scene.id)}
                  </Suspense>
                </ExampleBoundary>
              </ThemeScope>
            ) : null}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
      <Inline wrap justify="between" gap="md" paddingBlock="md">
        <Text as="p" variant="body">
          <span aria-hidden="true" className="try-dot" />
          <Text as="strong" weight="bold">
            Try it.
          </Text>{" "}
          {active.prompt}
        </Text>
        <Inline wrap gap="xs">
          <Button
            size="sm"
            variant="ghost"
            tone="neutral"
            startIcon={<RefreshIcon size={14} />}
            onClick={() => {
              setRevision((value) => value + 1);
            }}
          >
            Reset scene
          </Button>
          <Button
            size="sm"
            variant="ghost"
            tone="neutral"
            startIcon={<CodeIcon size={14} />}
            aria-expanded={inspect}
            aria-controls={`${id}-inspector`}
            onClick={() => {
              setInspect((value) => !value);
            }}
          >
            Inspect composition
          </Button>
          <Button
            size="sm"
            variant="ghost"
            tone="neutral"
            startIcon={<LinkIcon size={14} />}
            onClick={() => {
              void copyLink();
            }}
          >
            Copy scene link
          </Button>
        </Inline>
      </Inline>
      <Inline wrap gap="md">
        <Text as="p" variant="body">
          Real Flux components. Fictional products. Custom charts and editors
          are demo compositions, not published component APIs.
        </Text>
        <Link href={shareHash}>Scene permalink ↗</Link>
        <Text role="status">{copyMessage}</Text>
      </Inline>
      <Box id={`${id}-inspector`} hidden={!inspect}>
        {inspect ? (
          <ExampleBoundary key={active.id}>
            <Suspense
              fallback={
                <Text role="status" as="p" variant="body">
                  Loading composition details…
                </Text>
              }
            >
              <CompositionInspector scene={active} />
            </Suspense>
          </ExampleBoundary>
        ) : null}
      </Box>
    </Stack>
  );
}
