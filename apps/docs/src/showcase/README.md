# Product worlds

The same gallery drives the Overview and Playground. These are docs compositions,
not new public component APIs.

## Add a world

Create a pair under `scenes/`: `support-desk.scene.ts` and
`support-desk.preview.tsx`. Use lowercase words separated by single hyphens.

```ts
import { UsersIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";

export default {
  order: 6,
  label: "Support",
  brand: "hello",
  headline: "A little help goes a long way.",
  description: "A focused place to help your customers.",
  prompt: "Open a sample request. Write a local reply.",
  components: ["button", "textarea"],
  custom: "A docs-only inbox. No customer data or messages are connected.",
  Icon: UsersIcon,
} satisfies SceneDefinition;
```

Export a default React component from the preview. Use public Flux exports for
controls, layout, typography, surfaces, fields, and overflow. Compose `Stack`,
`Inline`, `Grid`, `Box`, and `Card` instead of creating a second layout system in
scene CSS. Use `Text` and `Heading` for ordinary typography, and use
`responsiveTo="container"` for layouts inside the gallery canvas.

Keep genuinely scene-specific SVG/CSS artwork small and isolated. Import its
stylesheet from the lazy preview module, not the application entry or shared
gallery. Declare its precise ownership in `tooling/dogfood/ownership.json`; a
visual-art exception must not hide an ordinary raw control. No registry/import
list edit is needed.
Metadata must stay lightweight because it is eagerly loaded. Do not import the
preview or media assets from the metadata module.

`pnpm docs:check` rejects missing/orphan pairs and invalid names. Browser fixtures
discover all pairs, so a new world joins viewport and mood/a11y coverage without a
second manual list. Add a focused behavior test for its own interactions.

## State, motion, and trust

Keep scene state in the preview. Mood is inherited through semantic CSS variables;
do not write docs appearance or root attributes. Scene switches and resets unmount
the preview. Mood changes do not. Do not add persistence, network calls, media
permissions, polling, automatic playback, or unbounded lists without designing and
documenting that behavior explicitly.

Use `Field` labels, accessible names, public native-backed controls, text alternatives for important
graphics, and visible status feedback. Keep meaningful text readable in all four
moods and in active/hover/disabled states. Motion must be opt-in and respect
reduced motion. Do not rely on clipping to hide unusable controls.

The ingredient list is typed against the generated public catalog. The inspector
loads the actual preview source only on request and identifies custom pieces.
Update the list and disclosure when replacing a prototype with a real component.

Source audit and validation limits: [`docs/showcase-audit.md`](../../../../docs/showcase-audit.md).

Current composition and ownership contracts: [`docs/dogfooding.md`](../../../../docs/dogfooding.md).

Run both `pnpm docs:check` and `pnpm dogfood:check`. Catalog coverage alone does
not prove that the surrounding page is using public components.
