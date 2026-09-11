import { lazy } from "react";
import type { ComponentType } from "react";
import type { SceneDefinition } from "./types.js";
const definitions = import.meta.glob<SceneDefinition>("./scenes/*.scene.ts", {
  eager: true,
  import: "default",
});
const previews = import.meta.glob<{ default: ComponentType }>(
  "./scenes/*.preview.tsx",
);
const sources = import.meta.glob<string>("./scenes/*.preview.tsx", {
  query: "?raw",
  import: "default",
});
/** Add a matching .scene.ts + .preview.tsx pair; no manual registry to update. */
export const showcaseScenes = Object.entries(definitions)
  .map(([path, definition]) => {
    const id = /\/([a-z-]+)\.scene\.ts$/u.exec(path)?.[1];
    if (id === undefined) throw new Error(`Invalid scene filename: ${path}`);
    const previewPath = `./scenes/${id}.preview.tsx`;
    const load = previews[previewPath];
    const loadSource = sources[previewPath];
    if (load === undefined || loadSource === undefined)
      throw new Error(`Missing showcase preview: ${id}`);
    // Stable lazy identities preserve scene state when only the mood changes.
    return { ...definition, id, Preview: lazy(load), loadSource };
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
if (showcaseScenes.length === 0)
  throw new Error("At least one showcase scene is required.");
export type ShowcaseScene = (typeof showcaseScenes)[number];
