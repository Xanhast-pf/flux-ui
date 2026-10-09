# @varua/tokens

## 0.1.0

### Minor Changes

- aac82d1: Add alpha Popover, DropdownMenu, Combobox, Tooltip, Toast, AlertDialog,
  InputGroup and Tag families with public composition examples and focused
  interaction tests. Improve Field relationships through rendered helpers and
  SSR-safe root slots, and recover uncontrolled Tabs after selected items become
  unavailable without overriding controlled owners.

  Extend scoped Paper, Studio, Bloom and Terminal moods with coherent density,
  radius and typography tokens while preserving their existing colors and
  spacing scale. New component size measurements and runtime regressions still
  require review; this changeset does not accept baselines or approve release.

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

### Patch Changes

- 1356a5a: Add a persistent, non-modal Sidebar with controlled/uncontrolled state, in-flow
  responsive layout, explicit toggling, native refs, and focus-safe closing.

  Restore hidden display contracts (without blocking until-found); isolate nested
  Tabs styling/keyboard navigation and Field colors/description ownership. Add
  finite text emphasis, a compact Container size and AspectRatio content alignment.
  Export an optional token-based reset stylesheet for normal application consumers.

  Migrate docs/default examples to public composition, strengthen exact ownership
  checks, and exercise built public exports in a standalone consumer smoke gate.

- 7c060e1: Add public repository/license/provenance metadata and distribute the MIT license
  with each package. Introduce a guarded OIDC release path with immutable tarball
  verification, package-scoped SPDX inventories and GitHub attestations.

  Redesign the documentation homepage and add the opt-in Stress Lab, Engineering
  page, evidence-backed Trust Center, on-demand axe demo and bundle/performance
  visualizations. CI generates same-commit, same-run evidence without claiming
  external certification or unearned badges.
