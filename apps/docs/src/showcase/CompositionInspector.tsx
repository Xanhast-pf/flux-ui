import { lazy, Suspense, useState } from "react";
import { Button } from "@flux-ui/react";
import { components } from "../generated/components.js";
import { REPOSITORY_URL } from "../lib/format.js";
import { CodeBlock } from "../ui/CodeBlock.js";
import { showcaseScenes, type ShowcaseScene } from "./catalog.js";
const sources = new Map(
  showcaseScenes.map((scene) => {
    const Source = lazy(async () => {
      const code = await scene.loadSource();
      return {
        default: function SceneSource() {
          return (
            <CodeBlock
              code={code}
              label={`${scene.label} composition source`}
            />
          );
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
    <section className="composition-inspector" aria-label="Composition details">
      <div>
        <p className="eyebrow">Built with the real thing</p>
        <h3>The ingredients, not the illusion.</h3>
        <div className="ingredient-links">
          {scene.components.map((slug) => (
            <a key={slug} href={`#components/${slug}`}>
              {components.find((entry) => entry.slug === slug)?.name ?? slug} ↗
            </a>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow">What is custom here?</p>
        <p>{scene.custom}</p>
        <p className="demo-help">
          Source below imports shared scene helpers. Styling and helpers live
          alongside the preview; this is composition source, not a standalone
          package.
        </p>
        <div className="scene-button-row">
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
          <a href={`${REPOSITORY_URL}/tree/main/apps/docs/src/showcase`}>
            Browse the showcase source ↗
          </a>
        </div>
      </div>
      {source ? (
        <div className="composition-source">
          <Suspense fallback={<p role="status">Loading source…</p>}>
            {sources.get(scene.id)}
          </Suspense>
        </div>
      ) : null}
    </section>
  );
}
