# AGENTS.md --- Flux UI engineering contract

This file is authoritative for human and AI contributors. If an
implementation conflicts with these rules, change the implementation
unless a deliberate architecture decision updates this document first.

## Mission

Flux UI is a high-performance React design system with a recognizable
visual language and unusually strong engineering guarantees. The goal is
**not** maximum component count. The goal is the highest-confidence
implementation of every component we publish.

Core promise:

> Easy until you need power. Powerful without becoming complicated.

## Non-negotiable product laws

1.  **Performance is a tested API.** Bundle size, unnecessary runtime
    work, DOM depth and interaction latency are regressions, not polish
    tasks.

2.  **Accessibility is structural.** Keyboard behavior, focus
    management, semantics, accessible names, contrast, reduced motion
    and screen-reader behavior are part of the component contract.

3.  **Simple API, complete capability.** Optimize the primary component
    API for common usage. Preserve advanced freedom through native
    props, composition, slots, hooks/primitives when behavior warrants
    them, \`className\`, \`style\`, data attributes and documented CSS
    variables.

4.  **No prop explosions.** Prefer composition or CSS before adding
    permanent public props. Boolean-prop soup is an API smell.

5.  **Use the platform.** Native HTML semantics and attributes beat
    Flux-specific reinventions.

6.  **Static styling by default.** Do not introduce a runtime CSS-in-JS
    engine. Styles must be generated statically; themes use CSS custom
    properties.

7.  **Adding components must stay easy.** Component #60 should be no
    harder to add than component #4. Manual project-wide registration is
    an architecture bug.

8.  **Generated surfaces are generated.** Never hand-edit
    \`packages/react/src/index.ts\`,
    \`apps/docs/src/generated/components.ts\`,
    \`apps/docs/src/generated/contracts.ts\`, or
    \`apps/docs/src/generated/readiness.ts\`.

9.  **No speculative complexity.** Do not add infrastructure,
    dependencies, abstraction layers or variants without a demonstrated
    use case.

10. **Coding Bible stays enabled.** Do not silence analyzer findings by
    excluding rules merely to make CI green. Fix the code or improve
    Coding Bible through its Canary-first process.

## Agent operating policy

These rules govern autonomous AI/Codex work in this repository. They are
operational guardrails in addition to the engineering rules below.

### Scope discipline

- Work only on the task explicitly requested.
- Prefer the smallest change that completely solves the requested
  problem.
- Do not broaden the task into adjacent refactors, cleanup, redesigns,
  or component work unless they are necessary to complete the request.
- Do not modify unrelated files merely because improvements are
  available.
- If an unexpected issue materially expands the scope, stop and report
  it.
- Inspect existing patterns before introducing a new abstraction.

### Repository safety

Unless explicitly requested, never:

- commit;
- push;
- create or delete branches/tags;
- publish packages;
- create releases;
- modify GitHub repository/settings/rulesets;
- change credentials, secrets, tokens, or environment configuration;
- force-reset or rewrite Git history;
- discard existing user changes;
- delete untracked files;
- run destructive filesystem or Git commands.

Treat pre-existing working-tree changes as user-owned. Do not modify or
revert them unless they are part of the requested task.

### Dependency policy for agents

Do not add, remove, or upgrade dependencies without explicit approval.

If a dependency appears necessary:

1.  explain why the platform/current dependencies are insufficient;
2.  identify the proposed dependency and expected runtime/build cost;
3.  stop and request approval before installing it.

Do not modify the lockfile incidentally.

### Quality gates are contracts

Never make a failing gate green by weakening the gate unless the task
explicitly changes that policy.

Do not, merely to pass CI:

- disable ESLint rules;
- add `eslint-disable`;
- add `@ts-ignore` / `@ts-expect-error`;
- introduce broad casts or `any`;
- skip/disable tests;
- weaken accessibility assertions;
- increase size/performance thresholds;
- exclude Coding Bible rules;
- remove dogfood ownership checks;
- hide failures behind retries.

If a tool produces a genuine false positive, stop and explain the
evidence before changing its configuration.

### Baselines require approval

Never automatically run or commit the results of:

- `pnpm flux size baseline accept`;
- `pnpm flux perf accept`;
- snapshot/baseline regeneration that accepts a regression;
- equivalent commands that redefine an existing quality baseline.

A changed fixture may legitimately require a new baseline. In that case:

1.  verify the fixture/reference is correct;
2.  run the measurement only when requested or approved;
3.  report old versus new measurements;
4.  leave acceptance of the new baseline to the user.

Generated registries required by normal implementation are not
considered quality baselines and may be regenerated normally.

### Command-cost discipline

Use the cheapest useful feedback loop.

During implementation, prefer this progression where applicable:

1.  inspect relevant source/tests;
2.  targeted unit test;
3.  targeted lint/typecheck;
4.  targeted package/component build;
5.  targeted browser test;
6.  affected size/performance check;
7.  broader package checks;
8.  full repository verification once at the end.

Do not repeatedly run `pnpm flux check all` while developing.

Run `pnpm flux check all` only when:

- targeted checks for the requested work are green; and
- the implementation is believed to be complete; or
- the user explicitly requests it.

If `pnpm flux check all` fails, run the smallest command reproducing each failure
while fixing it. Do not rerun the entire suite after every edit.

Before starting an unusually expensive command, briefly state why it is
needed.

### Loop prevention

Do not brute-force failures.

If the same failure remains after two reasonable fix attempts:

1.  stop;
2.  inspect the underlying architecture/configuration;
3.  report the current diagnosis;
4.  continue only when there is a materially different approach.

If a fix creates multiple unrelated new failures, reassess or revert
that fix rather than recursively patching symptoms.

### Stop-and-ask conditions

Stop and request approval when completing the task would require:

- a new runtime or development dependency;
- a public breaking API change;
- increasing a size/performance budget;
- accepting a new performance/size baseline;
- changing security-sensitive behavior or permissions;
- changing CI/release/publishing policy;
- modifying unrelated architecture;
- destructive data/filesystem operations;
- choosing between materially different product/API designs without an
  established Flux precedent.

Do not stop for ordinary implementation details already determined by
this engineering contract.

### Verification honesty

Never claim a check passed unless it actually ran successfully.

At completion report:

- what changed;
- important design decisions;
- files/areas affected;
- checks actually executed and their results;
- checks not executed;
- remaining risks or follow-ups.

Distinguish clearly between:

- verified behavior;
- source inspection/inference;
- checks blocked by the environment.

"Looks correct" is not equivalent to "verified".

### Working-tree discipline

Before editing, inspect `git status`.

After implementation, inspect the final diff.

Do not overwrite existing user modifications. If requested work overlaps
them, preserve their intent and call out the overlap.

Keep diffs focused. Large generated changes must have an explained
source.

### Autonomy level

Default autonomy is:

> Implement the requested task completely using established Flux
> patterns, validate it with targeted checks, and stop at approval
> boundaries.

The default is **not**:

> Find everything that could possibly be improved and keep changing the
> repository until no ideas remain.

### Regression-fix policy

When a change causes a size, performance, accessibility, type, lint,
dogfood, or Coding Bible regression, assume the implementation is wrong
before assuming the gate is wrong.

Investigate shared-cost regressions before accepting per-component
baseline growth. Do not normalize accidental overhead into a new
baseline.

Correctness fixes take precedence over byte recovery, but optimize the
implementation before proposing a justified baseline change.

## Architecture

\`\`\`text

@flux-ui/tokens

      ↓ semantic CSS variables

@flux-ui/react

      ↓

apps/docs

\`\`\`

\`packages/react\` owns component behavior/composition and
component-local styling. \`packages/tokens\` owns shared semantic
variables and default light/dark values. The docs application consumes
the source packages through Vite aliases so local development does not
require prebuilding.

Behavior-heavy primitives may adopt \`@base-ui/react\` when doing so
buys proven accessibility/browser behavior. Do not add Base UI to a
component that does not need it. The Flux component remains responsible
for public API, visual language, tokens, composition and quality
contracts.

## Component anatomy

Every public component directory follows this convention:

\`\`\`text

ComponentName/

├── ComponentName.tsx

├── ComponentName.types.ts

├── ComponentName.css.ts

├── ComponentName.test.tsx

├── ComponentName.stories.tsx

├── ComponentName.bench.tsx

├── component.meta.json

└── index.ts

\`\`\`

Optional component-local structure is allowed when justified:

\`\`\`text

internal/

useComponentName.ts

\`\`\`

Component-specific logic stays inside its component directory. Helpers
shared by multiple components belong under
\`packages/react/src/internal/\` and must remain small,
framework-appropriate and independently testable where meaningful.

## Adding a component

Always start with:

\`\`\`bash

pnpm flux component new ComponentName Category \[sizeClass\]

pnpm flux component doctor ComponentName

\`\`\`

Then implement the component and run:

\`\`\`bash

pnpm flux maintain generate

pnpm flux check

\`\`\`

The scaffold also creates a live docs preview
(\`apps/docs/src/examples/{slug}.preview.tsx\`) and its metadata
(\`{slug}.example.tsx\`). The metadata imports the preview's actual
source through Vite \`?raw\`; do not maintain an unrelated copy of
example code. Every public slug needs one discoverable example with
meaningful API notes, semantics and keyboard guidance. \`pnpm flux check docs\` and component doctor enforce example coverage. Add browser
checks for meaningful behavior, not just screenshots.

Do not create or maintain unrelated central registries manually. If a
new component requires editing multiple unrelated files simply to become
discoverable, improve the generator instead.

## Public API rules

### The normal path must be tiny

Preferred:

\`\`\`tsx

\<Button\>Save\</Button\>

\<Button _tone_="danger" _loading_\>Delete\</Button\>

\`\`\`

Avoid requiring configuration objects or providers for ordinary usage.

### Native props flow through

DOM-backed components should inherit the appropriate native element
props unless there is a concrete semantic conflict. Do not invent Flux
aliases for established browser APIs.

### Public types serve the consumer

The repository enables \`exactOptionalPropertyTypes\`, but public React
APIs must not force conditional spreads, casts, or other type-system
workarounds for ordinary application values. When an optional consumer
prop is commonly forwarded from state, explicitly allowing \`\|
undefined\` is intentional. Keep internal data contracts strict where
absence has meaning; absorb type complexity inside Flux rather than
exporting it to consumers.

### Controlled/uncontrolled naming is consistent

Use established patterns:

- \`value\` / \`defaultValue\` / \`onValueChange\`

- \`open\` / \`defaultOpen\` / \`onOpenChange\`

- \`checked\` / \`defaultChecked\` / \`onCheckedChange\`

- \`pressed\` / \`defaultPressed\` / \`onPressedChange\`

Do not invent component-specific synonyms. The compiler-derived public-contract gate enforces these callback/value families whenever a Flux convenience change callback is exposed.

### Component lifecycle

`component.meta.json` lifecycle is `alpha`, `beta`, or `stable`.

- `alpha` may carry promotion blockers while an API is still being shaped.
- `beta` requires all machine-verifiable promotion evidence reported by `pnpm flux component readiness`.
- `stable` requires the same evidence plus `stableSince` with the semver release where the stability promise began.

Changing lifecycle status remains a maintainer product/API decision. Automation proves prerequisites; it does not claim that an API has had enough real-world use or that a component is production-ready in every environment.

### Composition before configuration

For complex structures prefer compound/slot APIs over giant prop
surfaces. A Dialog should be composed from meaningful parts instead of
collecting dozens of header/footer/icon/alignment props.

### Escape hatches are intentional

Public components should preserve the ability to customize through the
appropriate combination of:

- native element props;

- \`className\`;

- inline \`style\` when the platform element supports it;

- stable \`data-\*\` state attributes;

- documented component CSS custom properties;

- compound slots/parts;

- a headless hook or low-level primitive only when the component has
  behavior worth reusing independently of its presentation.

The generated public-contract check derives callable exports and compound
parts from TypeScript. DOM-backed public surfaces must retain `className`
and `style` together, and every runtime component export must have a named
public `*Props` type. State-only controller/provider parts must be declared
locally through `component.meta.json` `nonDomParts`; do not add central
exception registries.

Do **not** expose internal reducers, private refs,
implementation-specific state machines or styling internals as public
API.

### Hooks are earned

Do not create \`useX\` solely for symmetry. A visual primitive such as
Separator does not need a headless hook. Dialog, Combobox, Select,
DataTable and similarly behavior-heavy components may warrant one.

### API review questions

Before adding a public prop ask:

1.  Can composition solve this?

2.  Can CSS solve this?

3.  Does the native platform already solve this?

4.  Is it common enough to deserve permanent API surface?

5.  Does this make contradictory prop combinations possible?

If the answer points away from a prop, do not add the prop.

## Iconography and identity

- Flux icons live in \`@flux-ui/icons\`, not inside
  \`@flux-ui/react\`. Keep the package independently tree-shakeable.

- \`packages/icons/icons.json\` is the canonical icon manifest. Run
  \`pnpm flux maintain generate\` after editing it; do not hand-maintain generated
  icon exports. Every icon must include useful lowercase search
  keywords, and aliases should be represented as keywords rather than
  duplicate SVG geometry.

- Icons use the 20 × 20 Flux grid, \`currentColor\`, a 1.5 default
  stroke, and a consistent square/geometric visual grammar. Deviations
  require an optical reason, not convenience.

- \`FluxMarkIcon\` intentionally uses a filled ribbon silhouette on
  the same grid. Its paths in \`icons.json\` also generate the color
  SVGs via \`scripts/generate-brand.mjs\`; normal icons keep the
  stroke contract.

- Icons are decorative by default. Add an accessible name only when
  the icon itself carries meaning; icon-only interactive controls
  still need their own accessible name.

- Do not introduce an icon runtime, icon font, sprite registry,
  provider, or CSS-in-JS dependency. A consumer importing one icon
  should not pay for the catalog.

- Per-icon emitted runtime cost is enforced by \`pnpm flux size icons\`.
  Raise that budget only through an explicit architecture decision.

- Flux Display is currently vector design source, not a production
  body font. Keep the source framework-agnostic under
  \`packages/identity/\` until the glyph set, spacing and optical
  corrections are mature enough for font engineering.

- Do not generate or commit binary font files until the vector
  letterforms have been reviewed as a system.

## Styling and design tokens

- Use Vanilla Extract for static component-local styles. Do not
  reintroduce a recipe runtime for simple visual variants.

- Do not add Emotion, styled-components or another runtime styling
  system to core packages.

- Shared design decisions use semantic CSS variables from
  \`@flux-ui/tokens\`.

- Reusable spatial values follow the Flux quarter-rem contract:
  explicit \`rem\` values, exact multiples of \`0.25rem\`, with
  \`1rem\` as the standard spacing and \`0.25rem\` as the standard
  radius.

- Spatial token definitions must never use \`calc()\`, \`clamp()\`,
  \`min()\`, or \`max()\`. Responsive components switch between
  explicit token values instead of manufacturing fractional geometry.

- Optical values such as hairline borders/focus strokes, percentages,
  transforms, and motion are exempt from the quarter-rem spatial grid
  when the rendering requirement genuinely demands it.

- Hardcoded values are acceptable only for truly component-local
  implementation details. Repeated visual decisions must become
  tokens.

- Prefer semantic naming (\`surface\`, \`textMuted\`, \`danger\`) over
  palette-position naming (\`gray700\`, \`blue500\`) in component
  code.

- Global theme switching should update CSS variables without forcing
  React tree rerenders.

- Consumer \`className\` must compose with Flux classes rather than
  replacing them.

- State styling should favor stable attributes such as \`data-open\`,
  \`data-selected\`, \`data-loading\`, \`data-invalid\`.

- Never require \`!important\` for ordinary consumer overrides.

## Motion

Motion communicates hierarchy/state; it is not decoration.

- Prefer \`transform\` and \`opacity\` for animation.

- Avoid layout animation unless the interaction genuinely requires it.

- Use shared motion tokens.

- Respect \`prefers-reduced-motion\` globally.

- Interactions must remain understandable when motion duration becomes
  zero.

## Performance rules

The default strategy is **do less work**:

- do not mount hidden expensive subtrees unnecessarily;

- do not render DOM without semantic/layout value;

- do not subscribe components to state they do not need;

- do not compute styles in React when CSS can resolve them;

- do not ship dependencies for trivial helpers;

- do not blanket components with \`memo\`, \`useMemo\`, or
  \`useCallback\` without evidence;

- do not make server-safe visual primitives client-only without a
  behavioral reason.

Bundle budgets are enforced by the dependency-free checker in
\`tooling/size/\`. Every public component is discovered automatically
and measured as an emitted runtime graph with raw, gzip and Brotli
metrics. New components default to the strictest \`primitive\` class.
Moving to a larger size class is an explicit architecture decision,
never a convenient way to silence a failure.

The checked-in size baseline is a regression contract, not a target to
update reflexively. If a component becomes materially larger, first
remove the regression; update the baseline only when the extra bytes are
justified by equivalent user value.

Runtime performance is measured in Chromium against equivalent
React/native references. Use paired native-relative synchronous
mount/update/unmount ratios as regression signals; next-frame
measurements are diagnostics because frame phase is naturally noisy.
Always interpret relative ratios together with absolute cost. Benchmarks
must be reproducible and never cherry-picked for marketing.

## Accessibility rules

- Correct semantic element first; ARIA second.

- Interactive elements require accessible names.

- Focus indicators may be styled but never removed without an
  equivalent.

- Disabled/loading states must preserve understandable semantics.

- Color must never be the sole state indicator.

- Reduced-motion behavior is part of the accessibility contract.

- Complex widgets must follow the relevant WAI-ARIA interaction
  pattern; prefer proven behavioral primitives rather than improvising
  keyboard models.

- Every docs page must remain axe-clean in the supported browser
  matrix unless a documented tool false positive is proven.

## React rules

- React 19 is the baseline.

- Prefer small components with explicit state ownership.

- Keep logic in hooks/helpers only when separation improves
  reuse/testability; do not create abstraction for abstraction's sake.

- Avoid giant Context values containing frequently changing state.

- Context should be local to a compound component unless the domain is
  genuinely global (for example theme configuration).

- Keep render paths deterministic and side-effect free.

- Never use array indexes as keys for reorderable/dynamic collections.

- Avoid \`any\`; narrow external data at boundaries.

## Tests

Each public component needs behavior tests. Add browser tests when
browser behavior matters more than jsdom fidelity.

Testing priorities:

1.  public behavior;

2.  semantics/accessibility;

3.  controlled/uncontrolled contracts where relevant;

4.  consumer escape hatches;

5.  edge states (\`loading\`, \`disabled\`, \`invalid\`, empty/error
    states where applicable);

6.  regressions discovered in real applications.

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

1.  web platform;

2.  React platform capability;

3.  tiny internal utility;

4.  external dependency when correctness/maintenance value clearly
    outweighs cost.

Accessibility-heavy primitives are a valid reason to depend on Base UI.
A utility function that takes ten lines is usually not.

## Coding Bible

Flux consumes \`@coding-bible/analyzer\` from the Coding Bible GitHub
monorepo until a registry package exists.

Rules:

- Keep all applicable automated rules enabled.

- Flux intentionally serves as a downstream canary for Coding Bible main.
  Declare main locally, retain an exact lockfile revision for reproducible
  installs, and use the live main Action in the dedicated canary workflow.
  Refresh the local resolution explicitly with pnpm flux maintain bible refresh.

- \`pnpm flux check bible\` is a required project quality gate.

- \`node scripts/run-coding-bible.mjs check . --staged\` runs in pre-commit.

- When Flux exposes a Coding Bible false positive/negative, create a
  Canary contract first, fix/promote Coding Bible, then upgrade Flux.

- Coding Bible complements ESLint, TypeScript, Prettier, tests and
  Flux-specific contracts; it does not replace them.

## Generated files

The following are generated and committed:

- \`packages/react/src/index.ts\`

- \`apps/docs/src/generated/components.ts\`

- \`apps/docs/src/generated/contracts.ts\`

- \`apps/docs/src/generated/readiness.ts\`

Run \`pnpm flux maintain generate\`. CI uses \`pnpm flux check generated\` and fails on
drift.

## Contributor command interface

Use `pnpm flux` for human repository commands; Node and pnpm are the only toolchain prerequisites.
`pnpm flux` lists concepts. `pnpm flux check` is the normal fail-fast gate; `pnpm flux check full`
adds browser/Storybook/runtime-sensitive checks. `pnpm flux check all` continues independent
checks and writes a local receipt. CI and hooks invoke the underlying Node task registry
directly. `pnpm flux doctor` is read-only.
`pnpm flux fix` writes generated source and safe lint/format fixes before checking.

## Quality commands

The commands below are available quality tools, not a checklist to
execute after every change. Choose the narrowest command that validates
the affected contract. Full-suite commands are final verification gates.

\`\`\`bash

pnpm flux dev

pnpm flux dev storybook

pnpm flux build storybook

pnpm flux component new Name Category \[sizeClass\]

pnpm flux component doctor Name

pnpm flux component readiness

pnpm flux maintain generate

pnpm flux test

pnpm flux perf bench

pnpm flux size

pnpm flux size changed

pnpm flux size release

pnpm flux perf smoke

pnpm flux perf

pnpm flux check bible

pnpm flux check

pnpm flux check full

\`\`\`

Use \`pnpm flux fix\` for deterministic formatting/lint/generation
fixes, then review the resulting diff.

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

## Docs as the public consumer contract

- Default live examples have no blanket teaching-fixture exception.
  Use public

  Flux layout, surfaces, typography, controls, fields and overflow APIs.

- Do not relocate app-owned CSS into inline styles to bypass ownership
  budgets.

  Geometry-only exceptions require exact files/components/properties and
reasons.

- Keep desktop persistent navigation in Sidebar. Mount its state above
  route content; desktop navigation must not close on route changes or Escape.
  At narrow widths, compose the public Drawer for temporary modal navigation
  instead of stacking navigation above scrolled content. Keep mobile open state
  separate, close it on navigation, and preserve desktop open preference across
  breakpoint changes. Sidebar itself remains non-modal.

- Preserve hidden keyboard/visibility semantics and isolate compound
  instances

  before optimizing selector or attribute bytes. Test actual browser
behavior.

- \`pnpm flux check full\` includes the built-public-export consumer, with no
  docs aliases or

  styles. The source-mode docs alone are not proof of package output
integrity.
