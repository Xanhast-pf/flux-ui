import { readdirSync } from "node:fs";
/** Generic coverage grows with the same file convention as the UI. */
export const sceneIds = readdirSync(
  new URL("../src/showcase/scenes/", import.meta.url),
)
  .filter((name) => name.endsWith(".scene.ts"))
  .map((name) => name.slice(0, -".scene.ts".length))
  .sort();
