# Public-component dogfooding

The documentation application is a consumer of Flux UI. Ordinary controls,
layout, typography, surfaces, fields, overflow, and feedback belong to the
public package, not to an application-only parallel design system.

Native HTML is still the output. SVG data geometry, brand illustrations, native
`option`/`optgroup` elements, and measured native performance fixtures are not
missing component families. Neither a Flux-to-DOM tag ratio nor a CSS line count
is a measure of accessibility, bundle size, or runtime performance.

## Compose one semantic element

`Box`, `Card`, `Stack`, `Inline`, `Grid`, `Grid.Item`, and `Container` accept a
constrained native `as` value. Native attributes and refs follow that selection.
Use `as="section"` with an accessible name when a named section is appropriate,
`as="form"` for form semantics, and `as="nav"` for navigation. Layout components
do not accept arbitrary interactive tags; use `Button` and `Link` instead.
There is no clone-based `asChild` layer or extra wrapper for semantic rendering.

`Heading` requires a level from 1 through 6 independently of its visual size.
`Text` defaults to inherited inline typography; select a body, caption, label,
eyebrow, lead, metric, or display role deliberately. `numeric` enables tabular
numerals. Form labels belong to `Field.Label`, not `Text`.

```tsx
import { Card, Heading, Stack, Text } from "@flux-ui/react";

export function Summary() {
  return (
    <Card as="section" aria-labelledby="summary-title" padding={6}>
      <Stack gap={3}>
        <Heading id="summary-title" level={2} size="lg">
          Account summary
        </Heading>
        <Text as="p" tone="muted" variant="body">
          A native section, shared spacing, and no page-specific panel CSS.
        </Text>
      </Stack>
    </Card>
  );
}
```

Use a normal anchor `Link` for navigation. Its `solid`, `soft`, `outline`, and `ghost` variants share the
button action recipe without changing browser navigation, download, ref, or
modifier-key behavior. It does not invent a disabled-anchor interaction model.
Native `className`, `style`, `ref`, and appropriate DOM attributes remain escape
hatches. Escape hatches do not justify duplicating a public control's styles in
the docs application.

## Finite spacing and local responsiveness

Layout gaps retain `none`, `xs`, `sm`, `md`, `lg`, and `xl`. Numeric token steps
`1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, and `16` address the corresponding
quarter-rem-based spacing tokens. `padding`, `paddingBlock`, and `paddingInline`
use the same finite steps. This is not a general-purpose CSS-prop framework.

Responsive layout values use `base`, `sm`, `md`, `lg`, `xl`, and `2xl`. They
respond to the viewport by default. For an embedded canvas, opt into a named
container on `Container` or `ThemeScope`, then select the container scope on
responsive descendants:

```tsx
import { Card, Grid, ThemeScope } from "@flux-ui/react";
import "@flux-ui/tokens/theme.css";
import "@flux-ui/tokens/presets.css";

export function EmbeddedPreview() {
  return (
    <ThemeScope theme="paper" query>
      <Grid columns={{ base: 1, md: 2 }} responsiveTo="container" gap={5}>
        <Card>First panel</Card>
        <Card>Second panel</Card>
      </Grid>
    </ThemeScope>
  );
}
```

The `flux-layout` container rules and equivalent viewport rules are emitted at
build time. Scoped layouts do not install a per-instance ResizeObserver. Grid
count, auto-fit minimum width, and explicit template modes remain mutually
exclusive. Component-local CSS custom properties reset between nested layout
instances so an outer responsive value is not accidentally inherited.

`Box` is neutral by default; `Card` retains its ordinary surface treatment.
Their shared recipe exposes finite padding, semantic surface, border, and radius
choices. A surface is not a button merely because it has a click handler.

## Themes and density

`@flux-ui/tokens/theme.css` remains the base light/dark contract. The separate,
optional `@flux-ui/tokens/presets.css` exports Paper, Studio, Bloom, and Terminal
selectors. Each preset defines all 30 semantic color roles, its body font stack,
and its color scheme rather than relying on unrelated outer page colors.
`ThemeScope` changes only its own subtree and does not remount child state.

Forced-colors mappings live in the base token layer. Artwork pigments remain
separate from semantic foreground, background, focus, and state colors. Token
contrast checks do not certify every rendered gradient, state, or composition;
run browser and accessibility checks before accepting visual changes.

`Field.Root density="compact"` coordinates labels, descriptions, and native
Input/Select/Textarea typography and control heights. Table has its own compact
option. Toggle, ToggleGroup, and Tabs expose finite size and appearance choices.
Do not recreate these through `.scene button`, selected-state, or private-class
selectors. Preserve visible focus, disabled behavior, and meaningful names.

## Content, overflow, and small compositions

- `ScrollArea` retains native scrolling and requires an accessible name. Its
  default tab stop exists only when the chosen axis actually overflows. An
  explicit `tabIndex` wins. Its local observers maintain that focus contract;
  they are not the mechanism used by responsive layouts.
- `Table.Caption visuallyHidden` stays a direct native caption. Do not wrap it
  in `VisuallyHidden` or hide focusable controls with a clipping utility.
- `Meter` represents a known finite value with finite ordered bounds. Render an
  explicit unknown/pending state instead of passing `null` or converting an
  unknown measurement to zero. It is not a task-progress replacement.
- `Code` renders literal source. `CodeBlock` composes it with native overflow and
  an optional copy action; clipboard denial gets honest manual-copy feedback.
- `ColorSwatch` is decorative. Its enclosing control/text owns the accessible
  name and selection state. `Avatar` owns native image/fallback behavior;
  `AvatarGroup` is its lightweight layout helper, not a separate catalog family.
- `List`, `DescriptionList`, `Stat`, `EmptyState`, `PageHeader`, `Fieldset`, and
  `SkipLink` expose reusable native composition instead of page-specific classes.

New families were scaffolded with matching metadata, source previews, stories,
benchmarks, and unit tests. Registries remain generated. Most new families use
the strict primitive complexity class. The four explicit composites are
`CodeBlock` (copy state plus code/scroll/action composition), `Stat` (description
list/value/note), `EmptyState` (heading/description/action slots), and `PageHeader`
(heading/eyebrow/intro/actions). These classifications describe composition; they
do not waive actual emitted-cost limits or authorize higher baselines.

## Ownership guardrail

Run `pnpm dogfood:check` in addition to `pnpm docs:check`.

The TypeScript AST check visits rendered source rather than counting strings in
examples. It rejects ordinary raw controls, typography, and layout that should
use Flux; private React-package subpaths; and source escapes without a declared
reason. Native performance references and narrow teaching fixtures are explicit
exceptions. An artwork exception cannot authorize a raw control nested inside it.

`tooling/dogfood/ownership.json` records file-local artwork classes and stylesheet
owners with finite declaration budgets. Per-scene artwork CSS must be imported by
the lazy preview module. Shared gallery CSS must not acquire another world's
entire design system. The CSS ownership scanner rejects common native-control,
selected-state, and global typography overrides. It is a deliberately bounded
ownership check, not a CSS parser, specificity proof, or security certification.

When adding a legitimate new illustration, record its exact file/class and
reason. Do not expand a broad prefix or increase a declaration cap to conceal a
missing public component. Test new exceptions against negative examples through
`pnpm dogfood:test`.

## Validation and evidence

```bash
pnpm generate
pnpm dogfood:check
pnpm dogfood:test
pnpm check
pnpm check:full
```

`pnpm generate` owns public exports and the docs registries. For a source handoff
created outside the pinned toolchain, use `pnpm check:fix` to regenerate, apply
lint fixes, and normalize formatting before strict verification.

The native-relative performance methodology, bundle budgets, baseline files,
immutable Coding Bible pin, and security workflows are unchanged. New families
show pending measurements until real emitted graphs have been measured. Source
CSS removal and lazy import placement are implementation changes, not proof of
network-byte or runtime savings. Review real route/scene chunks and component
costs before accepting a baseline update; never run an update solely to silence
a failure.

The optional chart/sparkline/timeline extractions in the audit remain a separate
follow-on. Existing cash-flow SVG, creative-tool geometry, and bundle/performance
bars stay explicitly docs-owned. They are not a public charting library, audio
engine, video player, or evidence of real financial/media operations.
