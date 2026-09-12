# Flux identity

Flux UI owns its visual identity in the same monorepo as the component system.

## Flux Icons

`@flux-ui/icons` is the public icon package. The current 64-icon set covers navigation, actions, status, theme, layout, content, communication, developer tooling and the Flux mark.

Design contract:

- 20 × 20 grid
- 1.5 default stroke
- `currentColor`
- rounded joins/caps with compact geometric silhouettes
- decorative by default
- regular SVG props and React 19 refs
- no provider, sprite sheet, icon font or styling runtime

The canonical source is `packages/icons/icons.json`. Every entry carries lowercase intent/search keywords; geometry aliases are rejected so discoverability does not create duplicate runtime glyphs. `pnpm generate` creates the public icon components, root exports and docs catalog. Browse the full set on the dedicated `#icons` docs route.

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

## Flux Display

Flux Display is currently an uppercase vector-lettering prototype, not a compiled font package.

The source lives in `packages/identity/src/flux-display.ts` and currently includes A–Z, 0–9 and a small punctuation set. The docs render those vector paths directly on the `#identity` route. The prototype renderer includes a full design-grid unit of optical padding so sharp mitered corners and Q/R tails are not clipped.

Current design targets:

- 1000 units/em
- 700 cap height
- 760 ascender
- -200 descender
- ~82-unit display stem
- square terminals
- open, technical geometry

The sequence before compiling a real font is:

1. approve the uppercase/digit forms;
2. make optical corrections at multiple sizes;
3. expand punctuation and symbols;
4. design lowercase;
5. establish spacing pairs;
6. add kerning;
7. only then perform font engineering.

Body copy and ordinary application UI continue to use highly readable system typography. Flux Display is intended for branding, headings and large metrics first.

## Ribbon F brand mark

`FluxMarkIcon` is the filled, monochrome ribbon F on the same 20 × 20 grid.
It inherits `currentColor`, remains decorative by default, and accepts the
same `IconProps` as every other icon. Its solid silhouette is the intentional
exception to the set's line-icon treatment. The wordmark in the app bar is
real text; Flux Display remains a separate type-design prototype.

The three Bézier paths in `packages/icons/icons.json` are the geometry source
for both the generated React icon and the full-color brand assets. Colors and
gradient coordinates live in `packages/identity/brand/flux-mark.json`.
Run `pnpm generate` after changing either source; `pnpm generate:check` checks
both the icon and the SVG copies served by the docs app.

Generated SVG variants:

- `flux-mark.svg`: transparent gradient mark for branding.
- `flux-mark-mono.svg`: standalone currentColor silhouette for vector editors.
- `flux-app-icon.svg`: gradient mark on a dark rounded tile for the favicon.

These are real vector paths and linear gradients, not embedded images. They
have no font, script, filter, or network dependencies. Each uses a square
viewBox so the symbol scales consistently at 16, 24, 32, and larger sizes.
Use the colored files through `<img>` (as the app bar does); inline copies need
unique gradient/title IDs. For inline React use, prefer `FluxMarkIcon`, which
needs no IDs. The `#identity` page offers the standalone SVG downloads.
