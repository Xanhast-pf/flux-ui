# Flux UI

**Beautiful by default. Fast by construction.**

[![CI](https://github.com/Xanhast-pf/flux-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/Xanhast-pf/flux-ui/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-222)](https://xanhast-pf.github.io/flux-ui/)

Flux UI is an **alpha-stage React design system** built around a few hard promises:

- simple, predictable public APIs;
- native semantics and tested accessibility;
- static, zero-runtime styling with Vanilla Extract and CSS variables;
- measurable bundle-size and browser-runtime budgets;
- convention-driven component authoring with no manual registry wiring;
- strict TypeScript, ESLint, Knip, tests, and Coding Bible gates.

> Easy until you need power. Powerful without becoming complicated.

**Live docs:** https://xanhast-pf.github.io/flux-ui/  
**Repository:** https://github.com/Xanhast-pf/flux-ui

## Status

Flux UI is under active development and is not yet a stable public package release. The current foundation includes:

- `Button`
- `Input`
- `Field`
- `Textarea`
- `Grid` / `Grid.Item`
- `Stack`
- `Inline`
- `Container`

The repository already enforces the same quality contracts intended for the mature library: generated exports, accessibility checks, bundle budgets, runtime-performance baselines, Storybook builds, and protected CI.

## Clone and run

### Requirements

- Node.js 24 (`.nvmrc` is included)
- pnpm 10.34.5

```bash
git clone https://github.com/Xanhast-pf/flux-ui.git
cd flux-ui

# If you use nvm; otherwise make sure `node --version` reports Node 24.
nvm use
corepack enable
pnpm install
pnpm check
```

`pnpm install` also installs the Git hooks through Husky.

For browser, accessibility, and runtime-performance checks, install Playwright's Chromium once:

```bash
pnpm --filter @flux-ui/docs exec playwright install chromium
pnpm check:full
```

On Linux, if Playwright reports missing system libraries, use:

```bash
pnpm --filter @flux-ui/docs exec playwright install --with-deps chromium
```

## Development

Run the public docs/dogfood application:

```bash
pnpm dev
```

Run the isolated component workbench:

```bash
pnpm storybook
```

Before pushing:

```bash
pnpm check
```

For changes involving browser behavior, accessibility, Storybook, or runtime performance:

```bash
pnpm check:full
```

See [`docs/development.md`](docs/development.md) for the complete local workflow, baseline rules, troubleshooting, and PR checklist.

## Add a component

Always scaffold components through the generator:

```bash
pnpm component:new SegmentedControl Inputs interactive
pnpm component:doctor SegmentedControl
```

A generated public component includes:

```text
SegmentedControl/
├── SegmentedControl.tsx
├── SegmentedControl.types.ts
├── SegmentedControl.css.ts
├── SegmentedControl.test.tsx
├── SegmentedControl.stories.tsx
├── SegmentedControl.bench.tsx
├── component.meta.json
└── index.ts
```

The generator also refreshes the committed public component and docs registries. Do not hand-edit generated registries.

A new component intentionally has no size baseline. After reviewing its emitted cost:

```bash
pnpm size:update
```

Commit the resulting `tooling/size/baseline.json` change with the component. Do **not** run baseline-update commands as part of normal first-time setup.

## Quality contracts

### Bundle size

Every public component is measured after the package build using raw, gzip, and Brotli sizes. Absolute limits come from the component's complexity class, while `tooling/size/baseline.json` prevents gradual regressions.

```bash
pnpm size:changed
pnpm size
pnpm size:release
```

See [`tooling/size/README.md`](tooling/size/README.md).

### Runtime performance

The Playwright/Chromium harness compares Flux with equivalent React/native implementations on the same machine and browser run. It records synchronous mount/update/unmount cost and next-frame diagnostics, while CI gates on stable native-relative synchronous ratios.

```bash
pnpm perf:smoke
pnpm perf
pnpm perf:update   # only when intentionally accepting a new baseline
```

See [`tooling/perf/README.md`](tooling/perf/README.md).

### Coding Bible

Flux dogfoods the full applicable Coding Bible analyzer catalog. The analyzer is pinned to an immutable Git revision.

```bash
pnpm bible:check
pnpm bible:staged
```

To intentionally move the analyzer pin:

```bash
pnpm bible:pin <tag-or-sha>
pnpm install
```

Do not exclude rules merely to make CI green.

## Repository map

```text
apps/
  docs/                  public docs + real-app dogfood surface
  storybook/             isolated component engineering workbench
packages/
  react/                 public React components
  tokens/                semantic tokens + default theme variables
docs/
  README.md              documentation index
  development.md         clone/setup/daily contributor workflow
  architecture.md        package and tooling architecture
  component-api.md       public API conventions
  performance.md         performance philosophy and contracts
scripts/
  new-component.mjs      component scaffolder
  generate-components.mjs generated exports/docs registry
  component-doctor.mjs   component structure validator
tooling/
  size/                  bundle-size contract + baseline
  perf/                  native-relative runtime contract
AGENTS.md                 authoritative engineering contract
CONTRIBUTING.md           contributor expectations
```

## Documentation

- [Developer setup and workflow](docs/development.md)
- [Architecture](docs/architecture.md)
- [Component API design](docs/component-api.md)
- [Design tokens](docs/design-tokens.md)
- [Performance](docs/performance.md)
- [Contributing](CONTRIBUTING.md)
- [Engineering contract](AGENTS.md)

## Philosophy

Flux does not aim to win by having the most components. It aims to publish the **highest-confidence components**: excellent defaults, small APIs, strong composition, measurable performance, accessibility, straightforward customization, and boring upgrades.

## License

[MIT](LICENSE)
