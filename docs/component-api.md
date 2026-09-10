# Component API design

Flux APIs should feel obvious in application code even when the implementation underneath is sophisticated.

> Strict against real mistakes. Forgiving about ordinary React usage.

## Layered API model

Flux components expose capability in this order:

1. excellent defaults;
2. a small set of common semantic props;
3. native element props;
4. composition/compound parts for structural customization;
5. `className`, `style`, data attributes, and documented CSS variables;
6. low-level hooks/primitives only when behavior is genuinely reusable independently of presentation.

A permanent public prop is more expensive than an internal implementation detail. Add public API only when repeated real-world usage proves it belongs there.

## The common path stays small

Preferred:

```tsx
<Button>Save</Button>
<Button tone="danger">Delete</Button>
```

Avoid requiring providers, option objects, or configuration layers for ordinary usage.

## Native props flow through

A DOM-backed component should inherit the appropriate React native-element props unless there is a concrete semantic conflict.

That means consumers naturally retain access to:

```tsx
<Grid.Item
  id="summary"
  className="summary"
  aria-label="Summary"
  data-testid="summary"
  onClick={handleClick}
>
  ...
</Grid.Item>
```

Do not manually reinvent `children`, `style`, `aria-*`, `data-*`, event handlers, or established browser attributes.

## Optional public props must remain ergonomic

The repository enables `exactOptionalPropertyTypes`. Internal configuration may use strict omission semantics, but consumer-facing React props should not force conditional-spread or casting workarounds.

When a public optional value is commonly forwarded from application state, explicitly allow `undefined`:

```ts
type Props = {
  gap?: LayoutGap | undefined;
};
```

This keeps normal React usage valid:

```tsx
const gap = compact ? "sm" : undefined;

<Grid gap={gap} columns={4} />;
```

Do not make consumers write conditional object spreads simply to satisfy library types.

## Prevent contradictory modes

TypeScript should reject combinations that cannot make semantic sense.

For example, `Grid` has distinct layout modes, so this is intentionally invalid:

```tsx
<Grid columns={4} minColumnWidth="16rem" />
```

while each mode independently remains simple:

```tsx
<Grid columns={{ base: 1, lg: 4 }} />
<Grid minColumnWidth="16rem" />
<Grid templateColumns="18rem minmax(0, 1fr)" />
```

## Naming conventions

Use consistent semantic vocabulary across the system.

Examples:

- `tone="danger"`, not component-specific synonyms such as `intent` or `status` when the concept is visual tone;
- `startIcon` / `endIcon`, using logical direction terminology;
- `value` / `defaultValue` / `onValueChange`;
- `open` / `defaultOpen` / `onOpenChange`;
- `checked` / `defaultChecked` / `onCheckedChange`.

Avoid introducing aliases for native concepts merely to make Flux look different.

## Compound glue should not tax standalone primitives

When a compound abstraction needs to coordinate an otherwise independent native-style control, keep that coordination at the compound boundary when practical. For example, `Field.Control` may inject labeling and validation attributes into its child without making every standalone `Input` subscribe to Field context.

This preserves the cheap standalone path while still making the composed path accessible by default. Compound glue that renders no semantic or layout value should not add DOM.

## Composition before configuration

For complex structures, prefer meaningful compound parts over giant prop surfaces.

Dialog and Drawer compose from meaningful parts such as Root, Trigger, Popup, Title, Description, and Close rather than collecting unrelated header/footer/alignment/icon props on one root object. Their first implementation deliberately uses the native `<dialog>` top layer instead of adding a behavior dependency; introduce another runtime only when a concrete platform gap justifies its size and complexity.

Likewise, application-specific composites such as dashboard cards or filter bars should begin as recipes/examples and only become permanent library APIs after reuse proves the abstraction.

## Structure-neutral layout primitives

Layout components may support an explicit composition escape hatch when forcing an extra `<div>` would harm semantics. This is deliberately narrower than making every Flux component universally polymorphic.

Do not introduce a library-wide `as`/polymorphic generic unless a demonstrated use case justifies its TypeScript and semantic cost.

## API review checklist

Before adding or approving a public API, ask:

1. Is the obvious usage obvious from autocomplete?
2. Can a normal variable, including an optional value, be passed without casts/workarounds?
3. Does the native platform already provide the concept?
4. Can composition or CSS solve it better than another prop?
5. Does the type system reject genuinely contradictory combinations?
6. Does the API preserve semantic HTML and accessibility?
7. Can advanced consumers escape without forking the component?
8. Is this common enough to deserve permanent API surface?

If the implementation is complicated but the usage is boringly obvious, Flux is doing its job.

## Navigation and overlay primitives

Navigation controls should preserve their native or ARIA-defined interaction model rather than merely copying a visual pattern.

- `Tabs` uses real buttons with `tablist` / `tab` / `tabpanel` relationships, roving focus, arrow-key navigation, and explicit controlled or uncontrolled selection.
- `Dialog` uses the native `<dialog>` top layer for modal focus behavior, Escape dismissal, and focus restoration while Flux owns composition, accessible labeling, styling, and state control.
- `Drawer` reuses the same native modal contract and changes spatial presentation instead of duplicating a second focus-management system.
- `Drawer` v1 intentionally omits swipe gestures and snap points; add them only when a concrete product use case justifies the extra runtime and API surface.
- Documentation or application navigation should remain semantic `<nav>` links. A Drawer may contain navigation on narrow screens, but Drawer is not itself a replacement for navigation landmarks.

## Native selection controls

Selection components should delegate browser behavior to native controls whenever the platform already provides the correct form and keyboard semantics.

- `Checkbox` renders one native checkbox and only bridges the DOM-only indeterminate property.
- `RadioGroup` renders a native fieldset/legend and same-name radio inputs. The browser owns exclusivity, arrow-key selection, form submission, constraint validation, and uncontrolled reset behavior.
- Controlled selection uses Flux's standard `value` / `onValueChange` contract without replacing the underlying form controls.
- Group-level coordination should not add hidden proxy inputs or duplicate form state.
