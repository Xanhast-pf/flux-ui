# Architecture

Flux is a pnpm workspace with intentionally few layers. The architecture is designed to keep component authoring simple while moving quality enforcement into shared tooling.

## Runtime package layers

```text
@flux-ui/tokens
      ↓ semantic CSS variables + themes
@flux-ui/react
      ↓ components + component-local static CSS
consumer application
```

`packages/tokens` owns shared semantic variables and default theme values. `packages/react` owns component behavior, composition, native semantics, and component-local Vanilla Extract styles.

No runtime CSS-in-JS engine is part of the core architecture. Theme changes should flow through CSS custom properties without forcing React rerenders.

## Development surfaces

```text
                    packages/react
                    packages/tokens
                         │
               ┌─────────┴─────────┐
               ▼                   ▼
          apps/storybook       apps/docs
          isolated lab         real dogfood app
               │                   │
       states / a11y / DX     guides / examples /
                              public GitHub Pages
```

### `apps/storybook`

Storybook is the component engineering workbench. Use it to develop isolated states and inspect component behavior without turning Storybook into the public Flux website.

### `apps/docs`

The docs application is the public product surface and a real Flux consumer. It should dogfood Flux primitives instead of reproducing them with app-specific abstractions. Every public component should gain a representative live docs example as soon as practical so API, styling, responsiveness, and accessibility problems are exercised in a real application. GitHub Pages deploys the production build after a successful `main` CI run.

## Build and styling

### Vanilla Extract

Component CSS is generated statically. Vanilla Extract provides locally scoped styles and recipes while preserving CSS custom properties for themes and consumer customization.

### Vite library mode

`@flux-ui/react` uses Vite/Rolldown multi-entry library output. Each public component has an emitted entry, allowing the size checker to measure the actual runtime graph a consumer pulls in.

`vite-plugin-lib-inject-css` associates emitted component chunks with static CSS imports rather than injecting styles into the DOM at runtime.

## Generated surfaces

Component discovery is convention-driven. These committed files are generated:

- `packages/react/src/index.ts`
- `apps/docs/src/generated/components.ts`

Run:

```bash
pnpm generate
```

CI runs `pnpm generate:check` and fails if generated output has drifted. Generated files should not be hand-edited.

## Component boundaries

A component keeps its implementation, types, styles, tests, Storybook story, benchmark fixture, metadata, and public index together:

```text
ComponentName/
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.css.ts
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
├── ComponentName.bench.tsx
├── component.meta.json
└── index.ts
```

Small helpers shared by multiple components belong under `packages/react/src/internal/`. Component-specific helpers stay with the component.

Behavior-heavy primitives may use `@base-ui/react` when it buys proven accessibility and browser behavior. Flux still owns the public API, visual system, tokens, composition, and quality contracts.

## Quality architecture

```text
source
  ├─ generation drift
  ├─ Prettier
  ├─ ESLint
  ├─ TypeScript
  ├─ Knip
  ├─ Vitest
  ├─ Coding Bible
  ├─ package/docs builds
  ├─ size contract
  ├─ Storybook build
  ├─ Playwright + axe
  └─ native-relative runtime performance
         ↓
      CI / Required
         ↓
       merge
         ↓
   GitHub Pages
```

CI intentionally exposes one stable `Required` status for repository protection while its internal quality/browser jobs can evolve independently.

## Design principle

Complexity should be paid once by Flux, not repeatedly by every consumer. Public APIs therefore optimize for obvious usage while architecture/tooling absorbs generation, validation, performance measurement, and compatibility work behind the scenes.
