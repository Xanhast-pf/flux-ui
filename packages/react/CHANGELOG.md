# @varua/flux-ui

## 0.2.0

### Minor Changes

- 81d800a: Add the native-first `Input` component and make `Button` default to `type="button"` so buttons do not accidentally submit surrounding forms.
- 2ff0d74: Add Badge, Callout, Card, Collapsible, Progress, Select, Separator, Slider, Switch, and Table.

  The new primitives preserve native DOM semantics, native form attributes and React refs, use static token-based styling, and add no runtime dependencies. Switch and Slider support optional change callbacks without owning checked/value state. Collapsible uses native details/summary; Select remains a native select; Table is semantic markup, not a data-grid engine.

  All ten components are initially classified under the existing primitive size budget. Their first production baselines must be measured before release. Existing public component implementations and size/performance policy thresholds are unchanged.

- 430f755: Add native-first `Dialog` and `Drawer` overlay primitives plus keyboard-accessible `Tabs`, establishing the navigation and overlay foundation used by the Flux documentation shell.
- aac82d1: Add alpha Popover, DropdownMenu, Combobox, Tooltip, Toast, AlertDialog,
  InputGroup and Tag families with public composition examples and focused
  interaction tests. Improve Field relationships through rendered helpers and
  SSR-safe root slots, and recover uncontrolled Tabs after selected items become
  unavailable without overriding controlled owners.

  Extend scoped Paper, Studio, Bloom and Terminal moods with coherent density,
  radius and typography tokens while preserving their existing colors and
  spacing scale. New component size measurements and runtime regressions still
  require review; this changeset does not accept baselines or approve release.

- cd385c8: Harden the first four human Core beta-review batches before 1.0. Tighten layout and Link contracts, remove unsupported read-only modes from Switch and Slider, align Kbd with shared typography tokens, improve optional-value ergonomics for layout and Combobox APIs, correct public docs, and revision the Slider performance workload after its controlled-input fixture changed.
- 4d0ea5a: Standardize Tabs on the pre-1.0 `Tab`/`Panel` compound API by removing the duplicate `Trigger`/`Content` aliases. Add machine-enforced canonical state vocabulary and lifecycle readiness evidence for Core promotion reviews.
- fa89cef: Add the native-first `Textarea` component with Field-compatible accessibility, static styling, native props, events, and refs.
- 95feda8: Add a native Checkbox primitive with checked/defaultChecked, a controlled
  indeterminate presentation, optional onCheckedChange, React 19 ref cleanup,
  and generic Field composition. Preserve native keyboard, form submission,
  constraint validation, and uncontrolled reset behavior without wrapper DOM,
  internal checked state, or a new runtime dependency.
- 0ea6478: Add a native-first `RadioGroup` compound primitive with fieldset/legend semantics, controlled or uncontrolled selection, browser-owned keyboard and reset behavior, required/disabled/invalid group state, external form association, and generic `Field` composition.
- 1356a5a: Add a persistent, non-modal Sidebar with controlled/uncontrolled state, in-flow
  responsive layout, explicit toggling, native refs, and focus-safe closing.

  Restore hidden display contracts (without blocking until-found); isolate nested
  Tabs styling/keyboard navigation and Field colors/description ownership. Add
  finite text emphasis, a compact Container size and AspectRatio content alignment.
  Export an optional token-based reset stylesheet for normal application consumers.

  Migrate docs/default examples to public composition, strengthen exact ownership
  checks, and exercise built public exports in a standalone consumer smoke gate.

- 9137a9c: Normalize the pre-1.0 public API before the first stable compatibility freeze.

  This release intentionally includes breaking pre-1.0 cleanup:

  - Semantic convenience callbacks are value-only. `Checkbox.onCheckedChange`, `Switch.onCheckedChange`, `Toggle.onPressedChange`, and the `onValueChange` callbacks on RadioGroup, Rating, Slider, NumberField, DatePicker, DateTimePicker, and TimePicker no longer receive a native event argument. Use the inherited native `onChange` or `onClick` handler when the DOM event is needed.
  - Visual treatment props are named `variant` instead of `appearance` on Collapsible, Tabs, Toggle, and ToggleGroup. Slider intentionally keeps `appearance="native" | "custom"` because it selects a rendering mode rather than a visual variant.
  - TreeView expansion state is now `expandedItems` / `defaultExpandedItems` / `onExpandedItemsChange` instead of `value` / `defaultValue` / `onValueChange`. `TreeView.Item value` remains the stable item identifier.
  - AlertDialog replaces the generic `AlertDialog.Close` part with explicit `AlertDialog.Cancel` and `AlertDialog.Action` parts.
  - Remove the standalone `GridItem` runtime export; compose `Grid.Item` instead. `GridItemProps` remains exported.
  - DataGrid and DataTable rename row-selection callbacks from `onSelectionChange` to `onSelectedRowIdsChange`, matching `selectedRowIds` / `defaultSelectedRowIds`.

  Controlled state callbacks that do not represent explicit manual delegation may now be omitted for read-only controlled state, and optional Flux-owned props accept explicitly forwarded `undefined` consistently.

  The generated public contract now inventories component lifecycle, exported public TypeScript types, declared runtime utilities, public parts, state models, CSS variables, and supported data-attribute styling hooks. No compatibility aliases are added for the removed pre-1.0 names.

- 37c966c: Add public layout, typography, scoped-theme, overflow, and content-composition
  foundations: Box, Text, Heading, Link, ThemeScope, Code, Meter, ScrollArea,
  ColorSwatch, CodeBlock, List, DescriptionList, Stat, EmptyState, PageHeader,
  Fieldset, and SkipLink. Add AvatarGroup alongside Avatar.

  Extend existing layout components with constrained native semantic elements,
  finite spacing, and static named-container responsiveness. Share surface and
  compact-control recipes, preserve native table captions, and add optional complete
  Paper, Studio, Bloom, and Terminal token presets.

  Migrate docs and product scenes to public components, isolate lazy scene artwork,
  and introduce an AST/CSS ownership guardrail. No runtime dependency or budget
  increase is included. New component size/performance measurements remain pending;
  review emitted output, runtime results, and browser accessibility before release.

- 2ff0d74: Add Accordion, AspectRatio, Avatar, Breadcrumbs, IconButton, Kbd, Pagination,
  Skeleton, Spinner, Toggle, ToggleGroup, Toolbar, and VisuallyHidden.

  Toolbar and ToggleGroup share scoped, RTL-aware roving focus with disabled-item
  handling and React 19 ref cleanup. Existing component implementations remain
  unchanged. The docs dogfood the additions through navigation, loading states,
  keyboard hints, and an interactive collection lab.

- ee01bd5: Add the compound `Field` primitive for accessible form labels, descriptions, errors, required state, disabled state, and validation wiring without adding runtime work to standalone controls.
- 93ec029: Add vertical/customizable Slider rendering, double-click reset for Slider and
  Knob, and Knob size presets and diameter overrides.
  Remove the deprecated Fader compatibility wrapper before 1.0; use Slider with
  orientation="vertical" for the same control. Compose
  NumberField in InputGroup, use public Checkbox controls in DataTable, and lock
  background scrolling while a Drawer is open. Existing imports and controlled
  ownership remain supported; size-baseline acceptance is not included.
- d53d046: Remove the experimental public Overflow component before 1.0. Tabs now automatically keeps the selected tab visible and presents hidden tabs in a Flux DropdownMenu. Remove `<Overflow>` and render ordinary Tabs; no migration wrapper or new overflow props are needed.

  Add reduced-motion-aware panel entrance transitions and discreet, themed native scrollbars to Flux scrolling surfaces. Wrapping and vertical Tabs retain their explicit layouts; native horizontal scrolling remains the progressive fallback.

- 4dc9a26: Harden action and selection APIs before beta. Button and IconButton now reserve loading-owned busy semantics, controlled ToggleGroup values require onValueChange, Toolbar buttons reserve loading-owned busy semantics, and Toolbar separators reserve their decorative role/orientation. Also improve Button optional-value ergonomics under exactOptionalPropertyTypes.
- 9137a9c: Promote the reviewed Core component cohort to Stable for the 0.2.0 release. Seventy-four mature component families now carry the normal public compatibility promise; Chart, ChartLegend, ChartTooltip, ColorPicker, Combobox, DataGrid, DataTable, PieChart, Rating, ScatterChart, and TreeView remain Alpha while their higher-volatility data and interaction models continue to mature.
- e72214d: Harden data and display APIs while their higher-volatility contracts remain Alpha. DataTable now makes sorting and selection ownership explicit, server-owned sorting requires a request callback, LevelMeter and Sparkline reserve runtime-owned accessibility semantics, composed data-display components reject incompatible innerHTML injection, and Stat/Tag optional values are friendlier under exactOptionalPropertyTypes.
- 38ebf7a: Harden feedback and status APIs before beta. Exposed Meter and Progress instances now require a programmatic name while decorative duplicates can be explicitly hidden, Progress rejects non-finite values and invalid maxima before native rendering, composed feedback components reserve dangerouslySetInnerHTML, and Toast/EmptyState optional values are friendlier under exactOptionalPropertyTypes.
- 6d6be8a: Harden the final Core catalog APIs before beta. Controlled Sidebar and SplitPane state now require owner callbacks, Sidebar toggle wiring and decorative Avatar/ColorSwatch semantics are runtime-owned, composed catalog primitives reject incompatible innerHTML injection, ScrollArea rejects hidden-but-focusable regions, and the Sidebar/SplitPane performance fixtures are revisioned after adopting explicit controlled owners.
- a36d454: Tighten Knob's pre-1.0 state ownership contract. Controlled knobs now require onValueChange and reject defaultValue, while uncontrolled knobs continue to support optional defaultValue and change notifications. Revision the Knob performance workload after its controlled fixture adopts the explicit owner callback.
- d09a7c9: Harden navigation and disclosure APIs before beta. Controlled Tabs now require onValueChange, Tabs no longer advertises semantic attributes its runtime owns, multiple Accordions reject ignored group names, and Pagination Previous/Next reject current-page semantics. Refresh Tabs documentation and revision the Tabs performance workload after its controlled fixture adopts an explicit owner callback.
- 9137a9c: Add the Alpha native-first `ColorPicker` and scoped `ThemeScope.colorOverrides` semantic color API, enabling predictable token-level Primary, Secondary, and custom Light/Dark theme composition without cross-palette hue blending.

### Patch Changes

- a1401f0: Export named props for every public runtime component alias and add a compiler-derived public contract that keeps component parts, DOM customization escape hatches, and typed component CSS variables synchronized with the documentation and quality gates.
- 9137a9c: Correct Combobox option semantics so keyboard highlight stays in `aria-activedescendant` while `aria-selected` reflects the committed value, make uncontrolled ColorPicker state honor native form reset (including external form association), and keep the audited high-volatility data/interaction cohort Alpha while those APIs continue to mature.
- 9137a9c: Harden embedded-document behavior across Toast, DataGrid, DataTable, Tabs, Popover, and Combobox, including Toast focus restoration, owner-document visibility timer pausing, and visible-state accessibility coverage.
- 93ec029: Keep Tabs focused on semantic panel selection, native scrolling, keyboard navigation
  and dynamic membership/focus recovery.

  Add Trigger/Content aliases while retaining Tab/Panel, and allow forwarded undefined
  values for optional Tabs and Drawer configuration.

- 9137a9c: Harden pre-release component boundaries and embedded-document behavior: DataGrid rejects invalid runtime sort directions, Combobox preserves committed disabled selections, and chart hits, data focus, rating scrubbing, tree navigation, and dropdown-menu navigation now follow their owner document in iframe and embedded contexts.
- 9137a9c: Harden the remaining Alpha data and interaction components without expanding their public APIs: keep chart series tones stable when legend visibility changes, reject duplicate Combobox option values, require non-empty DataGrid column headers, and correct the documented Rating value-change callback signature.
- 9137a9c: Harden controlled interaction commits and embedded-document focus restoration: Knob and SplitPane now commit the value proposed by keyboard interaction even before a controlled owner rerenders, and Sidebar restores focus through its panel's owner document.
- 37c966c: Restore predictable surface padding and consumer CSS overrides. Serialize sparse
  responsive layouts without repeating scalar values at every breakpoint, share
  Stack/Inline gap styles, and unify Grid's column-mode declarations. Share modal
  parts and remove the Drawer recipe runtime without changing its public API or
  native focus behavior. Keep public declarations while excluding development-only
  stories, examples, tests, and benchmarks from declaration output.
- 9137a9c: Keep horizontal Stepper connectors clear of step labels while preserving the connection to the following marker.
- 7c060e1: Add public repository/license/provenance metadata and distribute the MIT license
  with each package. Introduce a guarded OIDC release path with immutable tarball
  verification, package-scoped SPDX inventories and GitHub attestations.

  Redesign the documentation homepage and add the opt-in Stress Lab, Engineering
  page, evidence-backed Trust Center, on-demand axe demo and bundle/performance
  visualizations. CI generates same-commit, same-run evidence without claiming
  external certification or unearned badges.

- Updated dependencies [0974070]
- Updated dependencies [1a2f16a]
- Updated dependencies [aac82d1]
- Updated dependencies [1356a5a]
- Updated dependencies [37c966c]
- Updated dependencies [1a2f16a]
- Updated dependencies [7c060e1]
  - @varua/icons@0.1.0
  - @varua/tokens@0.1.0
