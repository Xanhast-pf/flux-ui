# Checkbox

A single native `<input type="checkbox">`, with Flux accent/focus styling and
no wrapper DOM, hidden proxy input, internal checked state, or behavior dependency.

## Basic usage

```tsx
<Field.Root>
  <Inline gap="sm">
    <Field.Control>
      <Checkbox defaultChecked name="updates" value="yes" />
    </Field.Control>
    <Field.Label>Release updates</Field.Label>
  </Inline>
  <Field.Description>
    Receive a message when a release is published.
  </Field.Description>
</Field.Root>
```

Field provides the accessible label, description, validation and shared disabled
or required state. The Checkbox itself does not subscribe to Field context.
A standalone Checkbox can also use a native label with matching `htmlFor` / `id`,
`aria-labelledby`, or `aria-label`. Labels remain the consumer's responsibility
outside Field.

## Controlled or uncontrolled

Use `defaultChecked` for a browser-owned initial value, or `checked` with a change
handler for an application-owned value. Do not switch between these modes or pass
both props on the same instance.

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  aria-label="Release updates"
  checked={checked}
  onCheckedChange={setChecked}
/>;
```

The native `onChange` pattern works as well:

```tsx
<Checkbox
  aria-label="Release updates"
  checked={checked}
  onChange={(event) => setChecked(event.currentTarget.checked)}
/>
```

`onCheckedChange(nextChecked, event)` is an optional convenience, not a replacement
for the native event. When both handlers exist, `onChange` runs first. Calling
`event.preventDefault()` there skips `onCheckedChange`; native cancellation
semantics still apply. The boolean passed to `onCheckedChange` is captured from
the input before consumer callbacks run.

## Mixed / indeterminate state

`indeterminate` is a controlled boolean describing a mixed selection. Keep it
separate from `checked`: a mixed input can still have either checked value.

```tsx
const allSelected = email && push;
const partiallySelected = email !== push;

<Checkbox
  aria-label="All delivery channels"
  checked={allSelected}
  indeterminate={partiallySelected}
  onCheckedChange={(nextChecked) => {
    setEmail(nextChecked);
    setPush(nextChecked);
  }}
/>;
```

The browser clears its native `indeterminate` property during activation. Flux
restores the current prop before calling consumer handlers; the parent then owns
whether to clear it or keep it mixed. Leaving `indeterminate={true}` means it stays
mixed, even after a click. There is intentionally no automatic three-state cycle
or `defaultIndeterminate` API.

The DOM property drives the native glyph and accessible mixed state. Flux does not
add a competing `aria-checked` value or serialize a nonexistent HTML
`indeterminate` attribute. Server rendering is supported, but mixed presentation
only appears when the input's ref attaches during hydration. Before hydration,
the browser displays its ordinary checked/unchecked fallback.

## Native forms and reset

- `name`, `value`, `form`, `required`, `disabled`, and native form events flow through.
- Only checked, enabled, named inputs participate in form data. Mixed presentation
  does not independently change submission; checked state decides.
- An uncontrolled checkbox resets to `defaultChecked` through the browser's reset
  algorithm, including when `form` associates it with a non-ancestor form.
- Native reset does not emit a change callback. Reset application-owned `checked`
  and `indeterminate` values in the form owner's `onReset` handler as needed.
- A disabled fieldset continues to disable the native input. Checkbox does not
  replace that behavior with a separate state machine.

Checkbox deliberately excludes `type`, `children`, `aria-checked`, and `readOnly`
from its public native-input type. The component owns its checkbox semantics;
HTML does not provide a read-only checkbox interaction mode. Use `disabled` when
interaction must be unavailable, or own the checked value and its change handler.

## Styling and refs

The default is a 1.5rem square native control, tinted using the semantic accent
token. Native check and mixed indicators may differ across browsers and operating
systems; that is intentional. No Flux animation is added. Forced-colors mode keeps
native rendering, with system-color focus and invalid outlines.

Use `className`, `style`, native pseudo-classes (`:checked`, `:indeterminate`,
`:disabled`, `:focus-visible`), and Field's `data-invalid` / `aria-invalid` state
for customization. Checkbox does not mirror uncontrolled checkedness into a
potentially stale `data-checked` attribute. Keep an obvious keyboard focus
indicator and an adequate pointer target when overriding dimensions.

Refs point to the actual `HTMLInputElement`. Object refs, callback refs, and React
19 callback-ref cleanup are supported. Unrelated rerenders do not detach a stable
consumer ref. Updating `indeterminate` reattaches the composed callback ref to
synchronize the DOM property; consumer cleanup and setup run for that change.

## Coverage and performance

The component includes unit contracts for native interaction, controlled values,
mixed state, event ordering, Field wiring, submission/reset, consumer escape
hatches, server markup, and ref lifecycles. Docs browser tests exercise selection,
keyboard input, form data, reset, forced colors, and axe scans in both themes.
These tests must run in the normal dependency-backed quality pipeline.

The SSR benchmark compares 1,000 native and Flux inputs. This does not measure
hydration, browser interaction latency, or screen-reader behavior. The existing
browser performance baselines are unchanged by this tranche.

Checkbox starts in the `primitive` size class (1,536 Brotli bytes). Its actual
production size is pending the first `pnpm size:update`; no size number is inferred
from source length and no budget is increased for the new component.

## References

- [React input reference](https://react.dev/reference/react-dom/components/input)
- [React ref callback lifecycle](https://react.dev/reference/react-dom/components/common#ref-callback)
- [Native indeterminate property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/indeterminate)
- [Native checkbox semantics](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox)
- [WAI-ARIA checkbox interaction pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
