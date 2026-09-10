# RadioGroup

`RadioGroup` coordinates mutually-exclusive choices while preserving native radio inputs, browser keyboard behavior, constraint validation, form submission, and form reset.

## Native-first structure

`RadioGroup.Root` renders a `<fieldset>`, `RadioGroup.Legend` renders a `<legend>`, and every `RadioGroup.Item` renders one `<input type="radio">`.

```tsx
<RadioGroup.Root name="release-channel" defaultValue="stable">
  <RadioGroup.Legend>Release channel</RadioGroup.Legend>
  <RadioGroup.Item aria-label="Stable" value="stable" />
  <RadioGroup.Item aria-label="Beta" value="beta" />
</RadioGroup.Root>
```

When `name` is omitted, Flux generates a stable internal name so the options still behave as one native radio group. Provide an explicit name when the selection should be submitted with a form.

## Field composition

Use `Field` around individual options when visible labels or descriptions are needed. `Field.Control` remains generic; there is no RadioGroup-specific integration path.

```tsx
<RadioGroup.Root name="release-channel" defaultValue="stable" required>
  <RadioGroup.Legend>Release channel</RadioGroup.Legend>

  <Field.Root controlId="channel-stable">
    <Inline gap="sm">
      <Field.Control>
        <RadioGroup.Item value="stable" />
      </Field.Control>
      <Field.Label>Stable</Field.Label>
    </Inline>
    <Field.Description>Recommended for production.</Field.Description>
  </Field.Root>
</RadioGroup.Root>
```

The group owns `name`, controlled/default selection, and shared required/disabled/invalid state. Each item may still be disabled independently.

## Controlled and uncontrolled selection

Uncontrolled groups leave selection state and reset behavior with the browser:

```tsx
<RadioGroup.Root name="channel" defaultValue="stable">
  ...
</RadioGroup.Root>
```

Controlled groups use the standard Flux value contract:

```tsx
const [channel, setChannel] = useState<RadioGroupValue>("stable");

<RadioGroup.Root name="channel" value={channel} onValueChange={setChannel}>
  ...
</RadioGroup.Root>;
```

Use `value={null}` for a controlled group with no current selection. Controlled mode requires `onValueChange` so React never receives a checked radio group without an update path.

## Keyboard and accessibility behavior

Flux does not reimplement radio keyboard interaction. Same-name native radios already provide the expected browser behavior: Tab enters the group, arrow keys move and select among enabled options, and Space selects the focused option.

The native `<fieldset>` and `<legend>` provide the group relationship and accessible name. `required` is applied to the radio inputs so native constraint validation remains active. `disabled` uses the native fieldset behavior and is also reflected on each item.

## Forms

Only the checked radio contributes the group's name/value pair to `FormData`. Uncontrolled groups reset to their `defaultValue` through the browser with no Flux state bookkeeping.

A `form` attribute on `RadioGroup.Root` is propagated to its items so an externally associated group submits correctly even when the fieldset sits outside the form element.
