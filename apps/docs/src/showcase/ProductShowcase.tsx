import { CodeIcon, LinkIcon, RefreshIcon } from "@varua/icons";
import {
  Box,
  Button,
  Grid,
  Heading,
  Inline,
  Link,
  Spinner,
  Stack,
  Tabs,
  Text,
  ThemeScope,
} from "@varua/flux-ui";
import { lazy, Suspense, useId, useState } from "react";
import {
  usePalettePreset,
  useSecondaryPalettePreset,
  useTheme,
} from "../lib/appearance.js";
import { useRoute } from "../lib/routing.js";
import { ExampleBoundary } from "../ui/ExampleBoundary.js";
import { showcaseScenes } from "./catalog.js";
import { readShowcaseRoute, showcaseHash } from "./model.js";

const CompositionInspector = lazy(() => import("./CompositionInspector.js"));
const sceneIds = showcaseScenes.map((scene) => scene.id);

const views = new Map(
  showcaseScenes.map((scene) => [scene.id, <scene.Preview />] as const),
);

export function ProductShowcase({ page }: { page: "overview" | "playground" }) {
  const route = useRoute();
  const theme = useTheme();
  const primary = usePalettePreset();
  const secondary = useSecondaryPalettePreset();
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

  const shareHash = showcaseHash("playground", active.id);
  const copyMessage =
    copyResult?.hash === shareHash
      ? copyResult.success
        ? "Dashboard link copied."
        : "Clipboard unavailable. Use the dashboard permalink."
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
      aria-label="Interactive dashboard showcase"
      className="product-showcase"
      as="section"
      gap="lg"
    >
      <Tabs.Root
        size="sm"
        variant="pill"
        value={active.id}
        onValueChange={(value) => {
          if (sceneIds.includes(value))
            window.location.hash = showcaseHash(page, value);
        }}
      >
        <Box border="block">
          <Stack gap={3} paddingBlock={5}>
            <Text variant="caption" tone="muted">
              Dashboards
            </Text>
            <Tabs.List wrap aria-label="Dashboard examples">
              {showcaseScenes.map((scene) => (
                <Tabs.Tab key={scene.id} value={scene.id}>
                  <scene.Icon size={18} />
                  <Text>{scene.label}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Stack>
        </Box>

        <Grid
          templateColumns={{
            base: "minmax(0, 1fr)",
            md: "minmax(0, 1fr) minmax(0, 24rem)",
          }}
          align="end"
          gap="xl"
          paddingBlock="xl"
        >
          <Stack gap="sm">
            <Text as="p" variant="eyebrow" tone="muted">
              {String(active.order + 1).padStart(2, "0")} / {active.label}
            </Text>
            <Heading level={2} size="lg">
              {active.headline}
            </Heading>
          </Stack>
          <Text as="p" variant="body">
            {active.description}
          </Text>
        </Grid>

        {showcaseScenes.map((scene) => (
          <Tabs.Panel key={scene.id} value={scene.id} padding="none">
            {active.id === scene.id ? (
              <ThemeScope
                theme={theme}
                data-flux-palette={primary}
                data-flux-secondary-palette={secondary}
                query
                border="all"
                radius="md"
                surface="canvas"
                className="world-surface"
              >
                <ExampleBoundary key={`${scene.id}-${revision}`}>
                  <Suspense
                    fallback={
                      <Stack align="center" gap="md" role="status" padding={16}>
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
          <Text as="strong" weight="bold">
            Try:
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
            Reset
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
            View components
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
            Copy link
          </Button>
        </Inline>
      </Inline>

      <Inline wrap gap="md">
        <Link href={shareHash}>Open dashboard ↗</Link>
        <Text role="status">{copyMessage}</Text>
      </Inline>

      <Box id={`${id}-inspector`} hidden={!inspect}>
        {inspect ? (
          <ExampleBoundary key={active.id}>
            <Suspense
              fallback={
                <Text role="status" as="p" variant="body">
                  Loading source…
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
