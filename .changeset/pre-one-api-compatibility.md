---
"@varua/flux-ui": minor
---

Normalize the pre-1.0 public API before the first stable compatibility freeze.

This release intentionally includes breaking pre-1.0 cleanup:

- Semantic convenience callbacks are value-only. `Checkbox.onCheckedChange`, `Switch.onCheckedChange`, `Toggle.onPressedChange`, and the `onValueChange` callbacks on RadioGroup, Rating, Slider, NumberField, DatePicker, DateTimePicker, and TimePicker no longer receive a native event argument. Use the inherited native `onChange` or `onClick` handler when the DOM event is needed.
- Visual treatment props are named `variant` instead of `appearance` on Collapsible, Tabs, Toggle, and ToggleGroup. Slider intentionally keeps `appearance="native" | "custom"` because it selects a rendering mode rather than a visual variant.
- TreeView expansion state is now `expandedItems` / `defaultExpandedItems` / `onExpandedItemsChange` instead of `value` / `defaultValue` / `onValueChange`. `TreeView.Item value` remains the stable item identifier.
- AlertDialog replaces the generic `AlertDialog.Close` part with explicit `AlertDialog.Cancel` and `AlertDialog.Action` parts.
- Remove the standalone `GridItem` runtime export; compose `Grid.Item` instead. `GridItemProps` remains exported.
- DataGrid and DataTable rename row-selection callbacks from `onSelectionChange` to `onSelectedRowIdsChange`, matching `selectedRowIds` / `defaultSelectedRowIds`.

Controlled state callbacks that do not represent explicit manual delegation may now be omitted for read-only controlled state, and optional Flux-owned props accept explicitly forwarded `undefined` consistently.

The generated public contract now inventories component lifecycle, exported public TypeScript types, declared runtime utilities, public parts, state models, CSS variables, and supported data-attribute styling hooks. No compatibility aliases are added for the removed pre-1.0 names.
