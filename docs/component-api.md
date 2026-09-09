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

## Composition before configuration

For complex structures, prefer meaningful compound parts over giant prop surfaces.

A future Dialog should compose from pieces such as trigger/content/title/actions rather than collecting dozens of unrelated header/footer/alignment/icon props on one root object.

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
