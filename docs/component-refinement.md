# Component refinement: controls, composition, and navigation

> **Historical implementation record.** This document describes the component-refinement state before the pre-1.0 cleanup. The deprecated `Fader` compatibility wrapper was subsequently removed; use `Slider orientation="vertical"` for vertical range controls. Measurements and component counts below intentionally remain as recorded at the time.

This change extends the existing public components. It does not rename exported
components, remove Fader, add runtime dependencies, or accept size regressions.

## Slider and Fader

`Slider` remains a native single-thumb range input. `orientation` supports
`horizontal` and `vertical`; vertical places the minimum at the bottom. Existing
horizontal inputs keep native appearance by default.

```tsx
<Slider
  aria-label="Level"
  orientation="vertical"
  appearance="custom"
  min={0}
  max={100}
  step={5}
  value={level}
  onValueChange={setLevel}
  resetValue={40}
  style={{
    "--flux-slider-length": "12rem",
    "--flux-slider-track-size": "0.25rem",
    "--flux-slider-thumb-inline-size": "2rem",
    "--flux-slider-thumb-radius": "0.25rem",
  }}
/>
```

The custom static skin also accepts `--flux-slider-thumb-size` and
`--flux-slider-thumb-block-size`. Sizes are logical dimensions and follow the
control's orientation. Native appearance deliberately leaves native track/thumb
painting to the browser. All ordinary native props, refs, className, and styles
remain available.

Fader is retained as a deprecated vertical Slider compatibility wrapper. Its
existing imports, form values, and callbacks remain supported. New code and the
Afterhours showcase use Slider directly. The component catalog remains at 70.

## Shared reset policy

Double-click is a shortcut, not the only accessible reset mechanism. Provide a
labelled Reset button, as the Slider, Knob, and Afterhours examples do.

| Ownership                                   | Reset target                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| Uncontrolled Slider                         | Initial browser-normalized position; native midpoint when no default is supplied. |
| Uncontrolled Knob                           | Initial declared default, clamped/snapped to the current range at reset.          |
| Either uncontrolled control with resetValue | The explicit target, normalized to the current bounds/step.                       |
| Controlled Slider or Knob                   | Explicit resetValue; the owner must accept the change. No target is guessed.      |

Changes to defaultValue after mounting do not move the captured reset target.
Use resetValue when the target itself is dynamic. Home and End retain their
minimum/maximum behavior. Disabled controls do not reset; Slider also respects
readOnly and a disabled fieldset. Consumer onDoubleClick cancellation prevents
the reset path, and the existing change-cancellation contracts remain intact.

Slider resets use the native value setter and input event, preserving the existing
`onValueChange(number, ChangeEvent<HTMLInputElement>)` API and React's controlled
restoration. No fake ChangeEvent or new event union is exposed. Native form reset
behavior remains distinct from this explicit shortcut.

Knob reset ends an active drag and keyboard interaction. It reports one changed
value and one commit; click-only pointer completions no longer emit no-op commits.
Unchanged resets do not emit another commit. Keyboard and pointer cancellation,
linear/logarithmic mapping, and fine stepping remain supported.

## Knob sizes

`size="sm" | "md" | "lg"` controls the dial diameter (3rem, 4rem, 5rem).
`style={{ "--flux-knob-size": "6rem" }}` overrides that diameter. Indicator and
ring geometry scale proportionally; `md` retains the existing nominal size.

## Input family and table selection

Input, NumberField, and InputGroup retain distinct, composable responsibilities.
Use Input for native text/search/email/number fields, NumberField for the numeric
callback with null on empty/incomplete entry, and InputGroup for adornments.
InputGroup.Input remains an Input adapter. A direct NumberField also composes
inside InputGroup.Root, including through Field.Control, without a second parser
or wrapper. The group owns the border and focus/invalid presentation; the native
input retains form semantics, constraints, accessible relationships, and refs.

DataTable uses the public Checkbox implementation for selection. It still renders
one native checkbox per selectable row and preserves identity-based selection,
sorting, virtualization, and focus handling. Production measurements must verify
the imported styling/runtime cost; sharing a control is not a claim of zero cost.

Combobox keeps its existing name and selection API. Documentation/search now
explain autocomplete-based selection from predefined options. Arbitrary free-text
submission is not silently introduced under the same value contract.

## CodeBlock and Toggle examples

Every advertised CodeBlock language has its own exhaustive, typed sample. The
literal HTML safety example is no longer a fallback for unrelated languages.
Tests check sample coverage and preservation through tokenization; browser tests
exercise the selector and clipboard for all 19 examples. The tokenizer remains a
bounded lexical highlighter, not a full language parser.

The Toggle example aligns the button at the start of its Stack rather than
stretching it to the changing status sentence. The button's API and styles are
unchanged.

## Semantic Tabs

Tabs retains native scrolling, explicit wrapping, orientation, keyboard navigation,
controlled ownership and dynamic membership/focus recovery. Automatic overflow
is deferred to a dedicated reusable Overflow investigation; no API is shipped here.

## Desktop Sidebar and mobile Drawer

Sidebar remains a persistent non-modal component. Desktop docs keep its state
above the route and preserve it through navigation and breakpoint changes.

Below 48rem, the docs use the public modal Drawer with separate temporary state.
Opening it after scrolling overlays the current viewport rather than inserting
navigation above the page. Escape/close restore focus without intentionally
scrolling the document; choosing a destination closes mobile navigation and lets
the existing route handler focus the new main content. Crossing back to desktop
closes the Drawer and restores a valid trigger, without clearing desktop state.

The public Drawer stylesheet locks document scrolling while any Drawer is open.
Its native dialog foundation continues to own modal focus and background
interaction. Closing or unmounting the last Drawer removes the CSS scroll lock.

Sidebar's preview uses a genuinely wide canvas for desktop and a labelled compact
Drawer example. The bare Sidebar's stacked fallback is not redefined as modal.
The former mobile non-modal docs assertions are intentionally replaced with
modal, focus, scrolling, routing, and breakpoint regression coverage. Desktop
non-modal assertions remain.

## Verification and protected contracts

Run targeted component tests and the new browser regressions before broader
checks. The normal consumer configuration now includes refinements.spec.ts; its
opt-in compatibility configuration inherits that coverage for all three engines.
The new pure model/source contracts run in the existing feature-test lane.

No accepted size record, budget, regression threshold, dependency, lockfile,
component classification, or trust/CI policy is changed. Build production packages
before measuring Slider/Fader, Knob, DataTable, InputGroup, Drawer, and Tabs. Do not
run size:update to accept growth automatically. Full React/browser/type/lint/size
validation is required before release acceptance; the delivery report records
which checks were actually available in the patch-generation environment.
