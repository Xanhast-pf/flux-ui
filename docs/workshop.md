# The Flux workshop

The public docs site is both a component reference and a working consumer of Flux. Its own requirements drive new primitives; it is not a reason to publish abstractions for every HTML element.

## Experience and routes

The overview combines a product introduction with a local release-room demo. The playground provides four labs: release room, button configuration, theme/accent exploration, and an interactive collection. All actions are local and explicitly labeled as demos. There is no backend, deployment action, email delivery, fake CI result, or arbitrary code evaluation.

The desktop sidebar uses semantic navigation links; the mobile version uses Flux Drawer. Search uses Flux Dialog, opens from its button or Ctrl/Cmd+K, filters component/reference links, supports normal Tab navigation, and closes with Escape. It deliberately is not labeled as a combobox or custom command widget.

| Hash                   | View                                                              |
| ---------------------- | ----------------------------------------------------------------- |
| `#overview` or no hash | Introduction and interactive release room                         |
| `#playground`          | Release room, Button lab, Theme lab, Collection lab               |
| `#components`          | Searchable/category-filtered summaries, not mounted demos         |
| `#components/{slug}`   | Lazy-loaded preview, source, API and usage guidance               |
| `#tokens`              | Token explorer with copyable variables and actual resolved colors |
| `#health`              | Committed repository health snapshot                              |
| `#size`                | Component and aggregate production-size measurements              |
| `#performance`         | Committed native-relative runtime measurements                    |
| `#rules`               | Coding Bible rule inventory                                       |
| `#install`             | Current project installation/development instructions             |
| `#documentation`       | Engineering documentation links                                   |

Hash navigation works with GitHub Pages without server rewrites. Existing section hashes are preserved. Browser back/forward works with ordinary links. Route changes move focus into the main content, and the skip link focuses that same landmark without replacing the route. Unknown routes show a recovery link. A failed or stale example chunk shows a reload action rather than blanking the whole shell.

## Example architecture

Every public component slug has `apps/docs/src/examples/{slug}.example.tsx`. That metadata imports a real preview component and its source, for example:

```tsx
import Preview from "./switch.preview.js";
import code from "./switch.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: ["Keep the on/off label stable."],
  props: [
    [
      "checked / defaultChecked",
      "boolean",
      "Native controlled or uncontrolled state.",
    ],
  ],
} satisfies ComponentExample;
```

The existing Checkbox and RadioGroup compositions import their maintained demo modules in the same way. Layout examples use a small amount of docs-only scaffolding CSS (such as `demo-boundary`) to make spacing visible; the controls themselves use public Flux exports.

Vite discovers metadata modules by filename with `import.meta.glob`. Metadata is loaded on demand through module-scoped React lazy views when an individual component route is visited; the catalog and search use only generated public metadata. Example components are not eagerly mounted or loaded merely to build the summary catalog. The source code shown is the source used to compile the preview, not a manually maintained duplicate and not user-supplied JavaScript.

Reset remounts only the preview. Preview/Code tabs preserve that preview's state. In the playground, switching labs unmounts the previous lab so inactive composed demos do not keep running; switching back starts fresh. Theme and accent persist independently in localStorage. Storage or clipboard denial is handled without pretending success.

Theme changes update root CSS variables. Only preference controls and token-value displays subscribe to preference changes; theme switching is not implemented by passing a context value through every public control.

`pnpm component:new` creates both preview and metadata files. `pnpm docs:check` verifies every public component has one example, flags orphaned examples and duplicate public slugs, and runs as part of `pnpm check`. Component doctor also checks example presence. The browser suite visits every generated public component route.

## Initial workshop primitive scope

| Component   | Scope                                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------- |
| Switch      | One checkbox input with switch semantics; native checked/defaultChecked and optional onCheckedChange; no mixed state |
| Select      | Native select with options/optgroups/multiple/size; not a searchable combobox                                        |
| Slider      | One native range input with numeric convenience callback; not a multi-thumb slider                                   |
| Card        | A non-interactive div surface; not a clickable-card abstraction                                                      |
| Badge       | A small descriptive span, never an implicit button                                                                   |
| Callout     | A static note by default; consumers opt into status/alert when appropriate                                           |
| Collapsible | Native details/summary disclosure; not a custom roving-focus accordion                                               |
| Progress    | Native progress, determinate with value and indeterminate without it                                                 |
| Separator   | Native hr, optionally vertical or decorative                                                                         |
| Table       | Semantic table parts; no sorting, virtualization, selection or data-grid engine                                      |

All ten preserve native props and refs where applicable, use static Vanilla Extract styles, and add no runtime dependency. The existing 13 component implementations are unchanged. No design-token contracts, lockfile, size policy, or runtime-performance policy is relaxed by this tranche.

The theme lab provides predefined indigo, teal and rose palettes, not an unrestricted color picker that could silently create unreadable contrasts. Native controls and semantic HTML remain the foundation. Focus, forced-colors and reduced-motion behavior must be checked in the actual browser pipeline before merge.

## Measurements and validation

The ten new components start in the existing primitive size class, with no invented size measurements. Pending values are shown as **Pending baseline**. Aggregate and ranking displays explicitly identify the last measured build while any current components are unmeasured. Committed measurements are not advertised as a live CI status.

On the repository's pinned Node 24 / pnpm toolchain:

```bash
pnpm generate
pnpm size:update
pnpm check:fix
pnpm check:full
pnpm perf
```

Review size-baseline changes, rather than accepting growth blindly. New baselines are warranted by new components; runtime baselines should not be regenerated merely because documentation has changed.

New coverage includes component-level semantics, form/reset/ref behavior, catalog-contract tests, route discovery, search/keyboard focus, clipboard success/failure, persisted preferences, preview reset, real release-room interactions, narrow viewports, and light/dark/overlay accessibility scans. Tests being included is not evidence that they have passed: run the exact dependency-backed pipeline before merging.

### Patch preparation checks

This patch was prepared in an environment running Node 22 without the repository's pnpm/dependency installation. It could run dependency-free tests, component-doctor checks, source syntax/import validation and archive/patch integrity checks, but not the exact ESLint, semantic TypeScript, Vitest, Playwright, Storybook or production-build pipeline. Generated data was derived from the repository generator; `pnpm generate` on the pinned toolchain normalizes its formatting. No production bundle numbers or browser audit results are claimed by the preparation checks.

## Collection expansion

Thirteen additional component families bring the catalog to 36. See
[`collection-components.md`](collection-components.md) for API boundaries,
keyboard contracts, and the implementation sources used for accessibility decisions.

The collection lab lets visitors save items, search, sort, switch grid/list layouts,
and page through real local data. The explicit loading-preview action swaps out the
results for placeholders; it does not run a fake request or keep hidden cards mounted.
Removing the focused item in the saved-only view moves focus to the stable results
region. Switching labs discards this demo's state.

The shell also dogfoods Breadcrumbs, IconButton, Toggle, Kbd, Skeleton and Spinner.
The documentation page uses Accordion for practical development questions. Every new
family has an independently discovered lazy example with copyable source.

Toolbar and ToggleGroup use the existing interactive class because their emitted
graph includes a shared focus collection. The other eleven start in the primitive
class. This is a declaration of intended complexity, not a measured size claim.
No existing component class, baseline, or budget is raised.
