# AGENTS.md — Flux UI engineering contract

This file is authoritative for human and AI contributors. If an implementation conflicts with these rules, change the implementation unless a deliberate architecture decision updates this document first.

## Mission

Flux UI is a high-performance React design system with a recognizable visual language and unusually strong engineering guarantees. The goal is **not** maximum component count. The goal is the highest-confidence implementation of every component we publish.

Core promise:

> Easy until you need power. Powerful without becoming complicated.

## Non-negotiable product laws

1. **Performance is a tested API.** Bundle size, unnecessary runtime work, DOM depth and interaction latency are regressions, not polish tasks.
2. **Accessibility is structural.** Keyboard behavior, focus management, semantics, accessible names, contrast, reduced motion and screen-reader behavior are part of the component contract.
3. **Simple API, complete capability.** Optimize the primary component API for common usage. Preserve advanced freedom through native props, composition, slots, hooks/primitives when behavior warrants them, `className`, `style`, data attributes and documented CSS variables.
4. **No prop explosions.** Prefer composition or CSS before adding permanent public props. Boolean-prop soup is an API smell.
5. **Use the platform.** Native HTML semantics and attributes beat Flux-specific reinventions.
6. **Static styling by default.** Do not introduce a runtime CSS-in-JS engine. Styles must be generated statically; themes use CSS custom properties.
7. **Adding components must stay easy.** Component #60 should be no harder to add than component #4. Manual project-wide registration is an architecture bug.
8. **Generated surfaces are generated.** Never hand-edit `packages/react/src/index.ts` or `apps/docs/src/generated/components.ts`.
9. **No speculative complexity.** Do not add infrastructure, dependencies, abstraction layers or variants without a demonstrated use case.
10. **Coding Bible stays enabled.** Do not silence analyzer findings by excluding rules merely to make CI green. Fix the code or improve Coding Bible through its Canary-first process.

## Architecture

```text
@flux-ui/tokens
      ↓ semantic CSS variables
@flux-ui/react
      ↓
apps/docs
```

`packages/react` owns component behavior/composition and component-local styling. `packages/tokens` owns shared semantic variables and default light/dark values. The docs application consumes the source packages through Vite aliases so local development does not require prebuilding.

Behavior-heavy primitives may adopt `@base-ui/react` when doing so buys proven accessibility/browser behavior. Do not add Base UI to a component that does not need it. The Flux component remains responsible for public API, visual language, tokens, composition and quality contracts.

## Component anatomy

Every public component directory follows this convention:

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

Optional component-local structure is allowed when justified:

```text
internal/
useComponentName.ts
```

Component-specific logic stays inside its component directory. Helpers shared by multiple components belong under `packages/react/src/internal/` and must remain small, framework-appropriate and independently testable where meaningful.

## Adding a component

Always start with:

```bash
pnpm component:new ComponentName Category [sizeClass]
pnpm component:doctor ComponentName
```

Then implement the component and run:

```bash
pnpm generate
pnpm check
```

Do not create or maintain unrelated central registries manually. If a new component requires editing multiple unrelated files simply to become discoverable, improve the generator instead.

## Public API rules

### The normal path must be tiny

Preferred:

```tsx
<Button>Save</Button>
<Button tone="danger" loading>Delete</Button>
```

Avoid requiring configuration objects or providers for ordinary usage.

### Native props flow through

DOM-backed components should inherit the appropriate native element props unless there is a concrete semantic conflict. Do not invent Flux aliases for established browser APIs.

### Public types serve the consumer

The repository enables `exactOptionalPropertyTypes`, but public React APIs must not force conditional spreads, casts, or other type-system workarounds for ordinary application values. When an optional consumer prop is commonly forwarded from state, explicitly allowing `| undefined` is intentional. Keep internal data contracts strict where absence has meaning; absorb type complexity inside Flux rather than exporting it to consumers.

### Controlled/uncontrolled naming is consistent

Use established patterns:

- `value` / `defaultValue` / `onValueChange`
- `open` / `defaultOpen` / `onOpenChange`
- `checked` / `defaultChecked` / `onCheckedChange`

Do not invent component-specific synonyms.

### Composition before configuration

For complex structures prefer compound/slot APIs over giant prop surfaces. A Dialog should be composed from meaningful parts instead of collecting dozens of header/footer/icon/alignment props.

### Escape hatches are intentional

Public components should preserve the ability to customize through the appropriate combination of:

- native element props;
- `className`;
- inline `style` when the platform element supports it;
- stable `data-*` state attributes;
- documented component CSS custom properties;
- compound slots/parts;
- a headless hook or low-level primitive only when the component has behavior worth reusing independently of its presentation.

Do **not** expose internal reducers, private refs, implementation-specific state machines or styling internals as public API.

### Hooks are earned

Do not create `useX` solely for symmetry. A visual primitive such as Separator does not need a headless hook. Dialog, Combobox, Select, DataTable and similarly behavior-heavy components may warrant one.

### API review questions

Before adding a public prop ask:

1. Can composition solve this?
2. Can CSS solve this?
3. Does the native platform already solve this?
4. Is it common enough to deserve permanent API surface?
5. Does this make contradictory prop combinations possible?

If the answer points away from a prop, do not add the prop.

## Styling and design tokens

- Use Vanilla Extract for component-local styles and recipes.
- Do not add Emotion, styled-components or another runtime styling system to core packages.
- Shared design decisions use semantic CSS variables from `@flux-ui/tokens`.
- Reusable spatial values follow the Flux quarter-rem contract: explicit `rem` values, exact multiples of `0.25rem`, with `1rem` as the standard spacing and `0.25rem` as the standard radius.
- Spatial token definitions must never use `calc()`, `clamp()`, `min()`, or `max()`. Responsive components switch between explicit token values instead of manufacturing fractional geometry.
- Optical values such as hairline borders/focus strokes, percentages, transforms, and motion are exempt from the quarter-rem spatial grid when the rendering requirement genuinely demands it.
- Hardcoded values are acceptable only for truly component-local implementation details. Repeated visual decisions must become tokens.
- Prefer semantic naming (`surface`, `textMuted`, `danger`) over palette-position naming (`gray700`, `blue500`) in component code.
- Global theme switching should update CSS variables without forcing React tree rerenders.
- Consumer `className` must compose with Flux classes rather than replacing them.
- State styling should favor stable attributes such as `data-open`, `data-selected`, `data-loading`, `data-invalid`.
- Never require `!important` for ordinary consumer overrides.

## Motion

Motion communicates hierarchy/state; it is not decoration.

- Prefer `transform` and `opacity` for animation.
- Avoid layout animation unless the interaction genuinely requires it.
- Use shared motion tokens.
- Respect `prefers-reduced-motion` globally.
- Interactions must remain understandable when motion duration becomes zero.

## Performance rules

The default strategy is **do less work**:

- do not mount hidden expensive subtrees unnecessarily;
- do not render DOM without semantic/layout value;
- do not subscribe components to state they do not need;
- do not compute styles in React when CSS can resolve them;
- do not ship dependencies for trivial helpers;
- do not blanket components with `memo`, `useMemo`, or `useCallback` without evidence;
- do not make server-safe visual primitives client-only without a behavioral reason.

Bundle budgets are enforced by the dependency-free checker in `tooling/size/`. Every public component is discovered automatically and measured as an emitted runtime graph with raw, gzip and Brotli metrics. New components default to the strictest `primitive` class. Moving to a larger size class is an explicit architecture decision, never a convenient way to silence a failure.

The checked-in size baseline is a regression contract, not a target to update reflexively. If a component becomes materially larger, first remove the regression; update the baseline only when the extra bytes are justified by equivalent user value.

Runtime performance is measured in Chromium against equivalent React/native references. Use paired native-relative synchronous mount/update/unmount ratios as regression signals; next-frame measurements are diagnostics because frame phase is naturally noisy. Always interpret relative ratios together with absolute cost. Benchmarks must be reproducible and never cherry-picked for marketing.

## Accessibility rules

- Correct semantic element first; ARIA second.
- Interactive elements require accessible names.
- Focus indicators may be styled but never removed without an equivalent.
- Disabled/loading states must preserve understandable semantics.
- Color must never be the sole state indicator.
- Reduced-motion behavior is part of the accessibility contract.
- Complex widgets must follow the relevant WAI-ARIA interaction pattern; prefer proven behavioral primitives rather than improvising keyboard models.
- Every docs page must remain axe-clean in the supported browser matrix unless a documented tool false positive is proven.

## React rules

- React 19 is the baseline.
- Prefer small components with explicit state ownership.
- Keep logic in hooks/helpers only when separation improves reuse/testability; do not create abstraction for abstraction's sake.
- Avoid giant Context values containing frequently changing state.
- Context should be local to a compound component unless the domain is genuinely global (for example theme configuration).
- Keep render paths deterministic and side-effect free.
- Never use array indexes as keys for reorderable/dynamic collections.
- Avoid `any`; narrow external data at boundaries.

## Tests

Each public component needs behavior tests. Add browser tests when browser behavior matters more than jsdom fidelity.

Testing priorities:

1. public behavior;
2. semantics/accessibility;
3. controlled/uncontrolled contracts where relevant;
4. consumer escape hatches;
5. edge states (`loading`, `disabled`, `invalid`, empty/error states where applicable);
6. regressions discovered in real applications.

Do not test private implementation details merely to increase coverage.

## Documentation

Docs are part of the product. Each component should demonstrate:

- basic usage;
- common variants/states;
- accessibility expectations;
- customization/escape hatches;
- relevant performance information;
- advanced/headless usage only if such an API genuinely exists.

Avoid examples that encourage APIs we would reject in production.

## Dependency policy

Every runtime dependency has a cost. Prefer, in order:

1. web platform;
2. React platform capability;
3. tiny internal utility;
4. external dependency when correctness/maintenance value clearly outweighs cost.

Accessibility-heavy primitives are a valid reason to depend on Base UI. A utility function that takes ten lines is usually not.

## Coding Bible

Flux consumes `@coding-bible/analyzer` from the Coding Bible GitHub monorepo until a registry package exists.

Rules:

- Keep all applicable automated rules enabled.
- Pin normal development to a known Canary-green Coding Bible tag/SHA rather than following experimental work indefinitely.
- `pnpm bible:check` is a required project quality gate.
- `pnpm bible:staged` runs in pre-commit.
- When Flux exposes a Coding Bible false positive/negative, create a Canary contract first, fix/promote Coding Bible, then upgrade Flux.
- Coding Bible complements ESLint, TypeScript, Prettier, tests and Flux-specific contracts; it does not replace them.

## Generated files

The following are generated and committed:

- `packages/react/src/index.ts`
- `apps/docs/src/generated/components.ts`

Run `pnpm generate`. CI uses `pnpm generate:check` and fails on drift.

## Quality commands

```bash
pnpm dev
pnpm storybook
pnpm storybook:build
pnpm component:new Name Category [sizeClass]
pnpm component:doctor Name
pnpm generate
pnpm test
pnpm bench
pnpm size
pnpm size:changed
pnpm size:release
pnpm perf:smoke
pnpm perf
pnpm bible:check
pnpm check
pnpm check:full
```

Use `pnpm check:fix` for deterministic formatting/lint/generation fixes, then review the resulting diff.

## Definition of done for a public component

A component is not done because it renders. It is done when:

- the common API is obvious and small;
- advanced customization does not require a fork;
- native semantics are preserved;
- keyboard/screen-reader behavior is correct;
- light/dark/reduced-motion states are coherent;
- behavior tests pass;
- docs exist;
- bundle budget remains healthy;
- Coding Bible, lint, types and tests are green;
- adding the component did not introduce project-wide manual wiring.
