# Flux UI

**Beautiful by default. Fast by construction.**

Flux UI is a React design-system project optimized around a small set of hard promises:

- static, zero-runtime styling;
- simple public APIs with deep escape hatches;
- accessibility as a tested behavior contract;
- measurable bundle and render budgets;
- convention-driven component authoring;
- easy custom styling through `className`, native props, data attributes, and documented CSS variables;
- Coding Bible on every meaningful code change.

## Requirements

- Node.js 24+
- pnpm 10.34.5

## Start

```bash
corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm install
pnpm generate
pnpm dev
```

Run the normal quality gate:

```bash
pnpm check
```

Run the browser-level accessibility/smoke gate too:

```bash
pnpm --filter @flux-ui/docs playwright:install
pnpm check:full
```

Run the isolated component workbench:

```bash
pnpm storybook
```

## Add a component

```bash
pnpm component:new SegmentedControl Inputs interactive
pnpm component:doctor SegmentedControl
```

The generator creates the component, tests, Storybook story, SSR benchmark, styles, metadata and public index, then regenerates the library/docs registries. Adding a component must not require unrelated manual registry edits.

## Size contract

Flux treats consumer bytes as a release contract. The checker under `tooling/size/` automatically discovers every public component and enforces raw, gzip and Brotli budgets plus a checked-in regression baseline. There is no per-component size list in `package.json`.

After the first build of a new checkout, initialize or intentionally refresh the baseline with:

```bash
pnpm size:update
```

Commit `tooling/size/baseline.json`, then the normal `pnpm check` gate enforces it. Use `pnpm size:changed` for fast local feedback and `pnpm size:release` for the strict release surface.

## Runtime performance contract

Flux benchmarks runtime overhead against native browser baselines rather than relying on raw milliseconds alone. The browser harness measures raw HTML, equivalent handwritten HTML/CSS, and Flux implementations on the same Chromium run, then gates on the Flux/reference ratio.

```bash
pnpm perf:smoke   # fast sanity check
pnpm perf:update  # intentionally record a baseline
pnpm perf         # full regression check
```

`Button` is compared directly with an unstyled native `<button>`. Layout primitives use an equivalent handwritten CSS reference when that produces a fairer measurement. See `tooling/perf/README.md`.

## Coding Bible

The scaffold consumes the analyzer directly from the public Coding Bible GitHub monorepo because the analyzer is not yet published to npm. Flux is pinned to an immutable Coding Bible commit rather than a moving branch. To move the pin after a Canary-green Coding Bible change:

```bash
pnpm bible:pin <tag-or-sha>
pnpm install
```

No Coding Bible rules are excluded by default. Flux should dogfood the full applicable analyzer catalog.

## Repository map

```text
apps/
  docs/                 public docs + dashboard dogfood app
  storybook/            isolated component engineering workbench
packages/
  react/                public React component package
  tokens/               semantic CSS variable names + default themes
scripts/
  new-component.mjs     component scaffolder
  generate-components.mjs generated exports/docs registry
  component-doctor.mjs  component structure validation
tooling/
  size/                  scalable bundle-size contract + baseline
  perf/                  native-relative browser performance contract
docs/
  architecture.md
  component-api.md
  performance.md
AGENTS.md                contributor/agent engineering contract
```

## Philosophy

Flux does not aim to win by having the most components. It aims to have the **highest-confidence components**: excellent defaults, deliberately small APIs, measurable performance, accessibility, customization, and boring upgrades.
