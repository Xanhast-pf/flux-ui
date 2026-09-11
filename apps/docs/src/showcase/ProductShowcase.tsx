import { lazy, Suspense, useId, useState } from "react";
import { CheckIcon, CodeIcon, LinkIcon, RefreshIcon } from "@flux-ui/icons";
import { Button, Tabs, ToggleGroup } from "@flux-ui/react";
import { useRoute } from "../lib/routing.js";
import { ExampleBoundary } from "../ui/ExampleBoundary.js";
import { showcaseScenes } from "./catalog.js";
import { isMood, moods, readShowcaseRoute, showcaseHash } from "./model.js";
import "./showcase.css";
const CompositionInspector = lazy(() => import("./CompositionInspector.js"));
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
    <section
      className="product-showcase"
      aria-label="Interactive product showcase"
    >
      <Tabs.Root
        value={active.id}
        onValueChange={(value) => {
          if (sceneIds.includes(value))
            window.location.hash = showcaseHash(page, value, selection.mood);
        }}
      >
        <div className="world-controls">
          <div className="world-selection">
            <span className="control-caption">Choose a world</span>
            <Tabs.List aria-label="Product worlds" className="world-tabs">
              {showcaseScenes.map((scene) => (
                <Tabs.Tab key={scene.id} value={scene.id}>
                  <scene.Icon size={18} />
                  <span>{scene.label}</span>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </div>
          <div className="mood-selection">
            <span className="control-caption" id={`${id}-moods`}>
              Set the mood
            </span>
            <ToggleGroup.Root
              type="single"
              value={selection.mood}
              onValueChange={(value) => {
                if (value !== null && isMood(value))
                  window.location.hash = showcaseHash(page, active.id, value);
              }}
              aria-labelledby={`${id}-moods`}
              className="mood-switcher"
            >
              {moods.map((mood) => (
                <ToggleGroup.Item
                  key={mood.id}
                  value={mood.id}
                  title={mood.description}
                >
                  <span
                    className="mood-swatch"
                    data-mood={mood.id}
                    aria-hidden="true"
                  >
                    <CheckIcon size={12} />
                  </span>
                  {mood.label}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </div>
        </div>
        <div className="world-story">
          <div>
            <p className="eyebrow">
              {String(active.order + 1).padStart(2, "0")} / {active.label}
            </p>
            <h2>{active.headline}</h2>
          </div>
          <p>{active.description}</p>
        </div>
        {showcaseScenes.map((scene) => (
          <Tabs.Panel key={scene.id} value={scene.id} className="world-panel">
            {active.id === scene.id ? (
              <div className="world-surface" data-mood={selection.mood}>
                <ExampleBoundary key={`${scene.id}-${revision}`}>
                  <Suspense
                    fallback={
                      <div className="scene-loading" role="status">
                        Opening {scene.brand}…
                      </div>
                    }
                  >
                    {views.get(scene.id)}
                  </Suspense>
                </ExampleBoundary>
              </div>
            ) : null}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
      <div className="showcase-underbar">
        <p>
          <span className="try-dot" aria-hidden="true" />
          <strong>Try it.</strong> {active.prompt}
        </p>
        <div className="showcase-actions">
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
        </div>
      </div>
      <div className="showcase-disclosure">
        <p>
          Real Flux components. Fictional products. Custom charts and editors
          are demo compositions, not published component APIs.
        </p>
        <a href={shareHash}>Scene permalink ↗</a>
        <span role="status">{copyMessage}</span>
      </div>
      <div id={`${id}-inspector`} hidden={!inspect}>
        {inspect ? (
          <ExampleBoundary key={active.id}>
            <Suspense
              fallback={<p role="status">Loading composition details…</p>}
            >
              <CompositionInspector scene={active} />
            </Suspense>
          </ExampleBoundary>
        ) : null}
      </div>
    </section>
  );
}
