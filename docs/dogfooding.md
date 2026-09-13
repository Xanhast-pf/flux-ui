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
static button action styles without changing browser navigation, download, ref, or
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
Their shared surface contract exposes finite padding, semantic surface, border, and radius
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
reason. Default live examples have **no blanket teaching exemption**. Only exact
performance-reference files and small non-UI DOM adapters are exempt. An artwork
exception cannot authorize an interactive control or ordinary HTML text inside it.

`tooling/dogfood/ownership.json` records file-local artwork classes and stylesheet
owners with finite declaration budgets **and exact selector/property contracts**. Per-scene artwork CSS must be imported by
the lazy preview module. Shared gallery CSS must not acquire another world's
entire design system. The CSS ownership scanner rejects common native-control,
selected-state, and global typography overrides, including descendant links and
table headers. The source checker rejects foreign UI imports, aliased native
factories, inline skins (including constant-object spreads), CSS-in-TS files,
unsafe HTML and imperative stylesheet injection. It is a deliberately bounded
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
follow-on. Existing cash-flow SVG and creative-tool geometry stay explicitly docs-owned.
Bundle/performance rows use public Grid, Text, Card, Meter and ScrollArea. They are not a public charting library, audio
engine, video player, or evidence of real financial/media operations.

## Persistent Sidebar, not a modal Drawer

`Sidebar.Root` owns controlled (`open`/`onOpenChange`) or uncontrolled
(`defaultOpen`) state. Compose `Sidebar.Toggle`, `Sidebar.Layout`,
`Sidebar.Panel`, `Sidebar.Content`, and an optional `Sidebar.Close`.
The panel requires `aria-label` or `aria-labelledby`. Put a named `Box as="nav"`
inside it for navigation links; this is not an ARIA menu.

```tsx
<Sidebar.Root>
  <Sidebar.Toggle>Toggle navigation</Sidebar.Toggle>
  <Sidebar.Layout>
    <Sidebar.Panel aria-label="Workspace navigation">
      <Stack gap="md">
        <Sidebar.Close>Close navigation</Sidebar.Close>
        <Box as="nav" aria-label="Workspace sections">
          <Link href="#overview">Overview</Link>
        </Box>
      </Stack>
    </Sidebar.Panel>
    <Sidebar.Content>{routeContent}</Sidebar.Content>
  </Sidebar.Layout>
</Sidebar.Root>
```

Keep Root, Panel and Layout **outside** the keyed route/Suspense content.
Open state, child state, and panel scrolling then survive route transitions.
The closed panel stays mounted but is hidden and not keyboard-reachable.
There is no backdrop, modal role, focus trap, body scroll lock, or automatic
close on Escape/navigation. Closing while focus is inside returns focus to an
external toggle; opening never takes focus away from the user.

At `48rem` and above, the panel occupies a column and pushes content sideways.
Below `48rem` it stacks in flow above the content, with a bounded native scroll
area. It does **not** become an overlay or leave the content a few pixels wide.
`--flux-sidebar-width` and `--flux-sidebar-offset` on Layout are optional public
integration hooks. The component owns no router or storage. The docs keep the
state for the current session; a full reload starts closed.

`Drawer` remains a native modal dialog for temporary workflows. Its Escape,
focus containment, backdrop and focus restoration contracts are unchanged.

## Defaults, rhythm, and instance boundaries

Use `Stack gap="md"` for a heading followed by a code block, list or paragraph.
A neutral Box does not create sibling spacing, and headings do not carry global
margins. Card padding and section rhythm are separate responsibilities.
`Text italic` and `Text decoration` provide finite text treatments; `Container
size="xs"` and `AspectRatio align="center"` replace hidden preview-only styles.

Components that author a display mode guard the normal HTML `hidden` state,
including against inline display overrides. The guard explicitly excludes
`hidden="until-found"`, allowing the browser's find/fragment reveal behavior.
Tabs use local part state rather than ancestor styling selectors; nested Tabs
keep their own orientation, size, appearance and keyboard navigation. Fields
reset their own label/description colors and do not claim a nested field's
help or error IDs.

The SkipLink preview is hosted in a hash-routed app. Its click adapter prevents
hash navigation and focuses its native target; the public SkipLink component
retains ordinary anchor behavior in a normal document. No axe rule is disabled
for the hosted preview.

## What "100% Flux" means here

All **ordinary reusable UI** in the live pages and default examples must be
expressible using public Flux components and props. A `Box` surrounding an
app-owned control skin does not qualify. Custom SVG drawings, plotted values,
brand assets, native options, and deliberately isolated native benchmarks are
not alternate UI libraries; their ownership is explicit and narrowly bounded.

This remains a reviewed architectural requirement, not a claim that an AST
checker can prove arbitrary JavaScript correct. Unknown new styling/imports fail
closed where the check can analyze them. Do not move a forbidden stylesheet into
an inline object to satisfy a count. Reassess any exception when it starts owning
ordinary control, layout, typography or surface behavior.

## Built-package consumer acceptance

`pnpm consumer:check` rebuilds the packages, typechecks a standalone consumer,
and runs its Chromium suite. The fixture in `apps/docs/consumer` imports only
public exports and the optional public `theme.css` / `reset.css` foundations.
Its Vite build has **no source aliases or Vanilla Extract plugin**, and rejects
runtime modules imported from a package's `src` tree or the docs implementation.
Public token CSS export paths are intentionally allowed. No docs stylesheet is
loaded. This tests emitted exports/declarations/CSS integration, not registry
availability or an npm-published release.

The full check, `verify:all`, and the required CI Browser job include that gate.
The Trust Center receives its executed `consumer-tests.json` report; missing or
failed consumer evidence blocks publication. Size and ownership budgets are
not widened by it. Standalone `icons:size` and `icons:size:update` rebuild icons
first, so old `dist` output cannot masquerade as a new measurement.
