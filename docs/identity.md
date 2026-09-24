# Flux identity

Flux UI keeps its visual identity in the same monorepo as the component system. The public identity is carried by the icon language, ribbon F mark, color/tokens, and component styling rather than a custom typeface.

## Typography

Flux UI does not ship, fetch, or require a custom webfont. Ordinary interface text uses the existing semantic font stacks from `@flux-ui/tokens`; code-related surfaces continue to use the dedicated monospace stack.

This keeps typography native to the consumer environment, avoids a font download/runtime dependency, and preserves the current layout/performance contract. Any future bundled or hosted font should be treated as a separate design, licensing, size, and browser-rendering decision rather than an implicit theme change.

## Flux Icons

`@flux-ui/icons` is the public icon package. The generated icon set covers navigation, actions, status, theme, layout, content, communication, developer tooling and the Flux mark.

Design contract:

- 20 × 20 grid
- 1.5 default stroke
- `currentColor`
- rounded joins/caps with compact geometric silhouettes
- decorative by default
- regular SVG props and React 19 refs
- no provider, sprite sheet, icon font or styling runtime

The canonical source is `packages/icons/icons.json`. Every entry carries lowercase intent/search keywords; geometry aliases are rejected so discoverability does not create duplicate runtime glyphs. `pnpm flux maintain generate` creates the public icon components, root exports and docs catalog. Browse the full set on the dedicated `#icons` docs route.

Use an icon as decoration when adjacent text already communicates the meaning:

```tsx
<Button startIcon={<SparkIcon aria-hidden="true" />}>Create</Button>
```

When an icon is the meaningful image itself, label it:

```tsx
<SearchIcon aria-label="Search" />
```

For icon-only controls, label the control rather than relying on the SVG:

```tsx
<IconButton aria-label="Search">
  <SearchIcon aria-hidden="true" />
</IconButton>
```

## Ribbon F brand mark

`FluxMarkIcon` is the filled, monochrome ribbon F on the same 20 × 20 grid. It inherits `currentColor`, remains decorative by default, and accepts the same `IconProps` as every other icon. Its solid silhouette is the intentional exception to the set's line-icon treatment.

The three Bézier paths in `packages/icons/icons.json` are the geometry source for both the generated React icon and the full-color brand assets. Colors and gradient coordinates live in `packages/identity/brand/flux-mark.json`. Run `pnpm flux maintain generate` after changing either source; `pnpm flux check generated` checks both the icon and the SVG copies served by the docs app.

Generated SVG variants:

- `flux-mark.svg`: transparent gradient mark for branding.
- `flux-mark-mono.svg`: standalone currentColor silhouette for vector editors.
- `flux-app-icon.svg`: gradient mark on a dark rounded tile for the favicon.

These are real vector paths and linear gradients, not embedded images. They have no font, script, filter, or network dependencies. Each uses a square viewBox so the symbol scales consistently at 16, 24, 32, and larger sizes. Use the colored files through `<img>` (as the app bar does); inline copies need unique gradient/title IDs. For inline React use, prefer `FluxMarkIcon`, which needs no IDs.
