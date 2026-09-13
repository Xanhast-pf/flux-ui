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

| Area                     | Current components                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Actions                  | Button, IconButton, Toggle, ToggleGroup, Toolbar                                                                           |
| Forms                    | Input, Field, Fieldset, Textarea, Checkbox, RadioGroup, Switch, Select, Slider                                             |
| Layout and surfaces      | Box, Container, Grid / Grid.Item, Stack, Inline, Card, Separator, AspectRatio, ThemeScope, ScrollArea                      |
| Typography and content   | Text, Heading, Link, Code, CodeBlock, List, DescriptionList                                                                |
| Information and feedback | Badge, Callout, Progress, Meter, Table, Avatar / AvatarGroup, ColorSwatch, Stat, EmptyState, PageHeader, Skeleton, Spinner |
| Disclosure and overlays  | Collapsible, Accordion, Dialog, Drawer                                                                                     |
| Navigation               | Sidebar, Tabs, Breadcrumbs, Pagination                                                                                     |
| Accessibility and hints  | VisuallyHidden, Kbd, SkipLink                                                                                              |

The repository already enforces the same quality contracts intended for the mature library: generated exports, accessibility checks, bundle budgets, runtime-performance baselines, Storybook builds, and protected CI.

## Explore the workshop

The GitHub Pages app is a real consumer of the public library, not just a health dashboard. It also contains an Identity lab for the original Flux icon set and the in-progress Flux Display vector alphabet. Explore a local release-room demo, save/filter/page through the collection lab, customize a button, switch theme/accent presets, search with Ctrl/Cmd+K, and open dedicated component pages with live previews, copyable source, API notes and measured size information.

The component catalog does not mount every demo. Individual examples load on demand; the displayed code is imported from the same TSX source as the rendered preview. Search uses Flux Dialog; persistent documentation navigation uses the public non-modal Sidebar. It pushes content on wider screens and stacks above it on narrow screens, without closing on route changes. Drawer remains available for temporary modal tasks. Component pages use Breadcrumbs, Toggle and IconButton; loading examples use Skeleton and Spinner, and keyboard shortcuts remain available through Ctrl/Cmd+K. Existing health, size, performance, install and token deep links remain available; the legacy rules route opens Engineering.

Demos do not deploy anything or send messages. Only theme and accent preferences persist locally. Size figures are committed measurements, not live CI results; newly added components show **Pending baseline** until measured.

See [`docs/workshop.md`](docs/workshop.md) for routes, source conventions, scope, and browser verification.

The default examples and docs compose public layout, typography, surfaces, scoped themes, and native-backed controls. [`docs/dogfooding.md`](docs/dogfooding.md) describes the ownership guardrail, constrained semantic APIs, and deliberate artwork/performance exceptions. This is not a zero-CSS claim or a replacement for browser validation.

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

The full gate includes `pnpm consumer:check`: a separate production consumer that resolves built public exports without the docs source aliases or styles.

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

The generator also creates `apps/docs/src/examples/{slug}.preview.tsx` and `{slug}.example.tsx`, then refreshes the committed public component and docs registries. Implement the preview and its API/accessibility notes alongside the component. `pnpm docs:check` rejects missing or orphaned docs examples. Do not hand-edit generated registries.

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

See [`docs/checkbox.md`](docs/checkbox.md) for Checkbox composition, controlled and mixed state, native reset behavior, and accessibility expectations.

See [`docs/radio-group.md`](docs/radio-group.md) for RadioGroup fieldset semantics, controlled/uncontrolled selection, native keyboard behavior, form integration, and Field composition.

## Flux identity

Flux includes an original icon package alongside the React component package:

```bash
pnpm add @flux-ui/react @flux-ui/icons
```

```tsx
import { SearchIcon, SparkIcon } from "@flux-ui/icons";

<SearchIcon aria-label="Search" />
<SparkIcon aria-hidden="true" size={24} />
```

Icons are generated from `packages/icons/icons.json`, use `currentColor`, and are decorative by default unless labelled. The dedicated `#icons` docs route browses all 64 icons by name, category, or intent metadata. `pnpm icons:size` enforces a strict per-icon runtime budget.

Flux Display currently lives as vector design source in `packages/identity/`; it is deliberately not shipped as a compiled font yet. The live `#identity` docs route renders the glyph geometry directly so the letterforms can be evaluated before font engineering. The renderer reserves optical padding around mitered glyph geometry and reports unsupported specimen characters instead of silently presenting the prototype as complete.

See [`docs/identity.md`](docs/identity.md) and [`docs/icons.md`](docs/icons.md).

## Repository map

```text
apps/
  docs/                  public docs + real-app dogfood surface
  storybook/             isolated component engineering workbench
packages/
  react/                 public React components
  icons/                 original tree-shakeable Flux iconography
  identity/              private vector identity/type design source
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
  generate-icons.mjs     generated icon components + catalog
  component-doctor.mjs   component structure validator
tooling/
  icons/                 per-icon bundle-size contract
  size/                  component bundle-size contract + baseline
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

## Explore the system and its evidence

The docs homepage introduces the design language and live product examples. New
routes make the engineering inspectable without shipping a charting library in
the component package:

| Route                    | What it shows                                                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#lab`                   | Opt-in Button/Grid native-React comparisons; bounded instance counts, alternating sample pairs, scaling sweeps, stop controls and raw JSON export. |
| `#engineering`           | Token/component architecture, contribution conventions, API escape hatches, measurement scope and explicit limitations.                            |
| `#trust`                 | Same-build CI receipts when available, raw reports, hashes, security workflow links and honest external-enrollment status.                         |
| `#accessibility`         | On-demand, locally bundled axe scanning of a demo, an intentional missing-name defect, repair and real findings/export.                            |
| `#size` / `#performance` | Searchable compression-aware bundle bars and native/Flux timing charts alongside the existing budgets and detailed tables.                         |

Local measurements are not committed CI baselines. Baselines are not live
measurements. Passing checks are not independent certification. Component graph
sizes exclude externals and overlap; do not sum them into an application bundle.
The live lab and axe engine load on demand; benchmark and scan results stay local.

### Generated evidence

`pnpm trust:quality` and `pnpm trust:browser` execute the fixed check commands and
record exit-status receipts in `.cache/trust/`. Quality includes a clean tracked
working-tree check, so commit intentional changes first. `pnpm trust:generate`
combines executed receipts and complete reports; `--require-ci` refuses local or
failed/mismatched inputs. CI publishes `evidence/index.json`, `quality.json`,
`browser.json`, `size.json`, `runtime.json`, and `browser-tests.json` with Pages.
Generated evidence is ignored by Git. No placeholder green reports are committed.

Run the dependency-free evidence, statistics and release contract tests with
`pnpm trust:test` (also included in `pnpm test`). New Chromium tests cover lab
execution/cancellation, evidence failures, live axe detection/repair, mobile
layout and the new routes' accessibility in both themes.

### Activate external trust and publishing

See [owner setup](docs/trust/SETUP.md), [security policy](SECURITY.md), and the
[OpenSSF application worksheet](docs/trust/BEST-PRACTICES.md). Repository settings,
npm package authorization and the OpenSSF application require maintainer action.
The release workflow is manual, main-only and dry-run by default. It builds/packs
once, creates package-scoped SPDX inventories in a read-only job, then verifies,
attests and publishes the exact tarballs with OIDC in the protected `npm`
environment. Local token-based `pnpm release` is intentionally disabled.
