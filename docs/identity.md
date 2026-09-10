# Flux identity

Flux UI owns its visual identity in the same monorepo as the component system.

## Flux Icons

`@flux-ui/icons` is the public icon package. The initial set covers navigation, actions, status, theme, layout, developer tooling and the Flux mark.

Design contract:

- 20 × 20 grid
- 1.5 default stroke
- `currentColor`
- rounded joins/caps with compact geometric silhouettes
- decorative by default
- regular SVG props and React 19 refs
- no provider, sprite sheet, icon font or styling runtime

The canonical source is `packages/icons/icons.json`. `pnpm generate` creates the public icon components, root exports and docs catalog.

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

The source lives in `packages/identity/src/flux-display.ts` and currently includes A–Z, 0–9 and a small punctuation set. The docs render those vector paths directly on the `#identity` route.

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
