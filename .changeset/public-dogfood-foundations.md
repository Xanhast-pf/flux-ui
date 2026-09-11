---
"@flux-ui/react": minor
"@flux-ui/tokens": minor
---

Add public layout, typography, scoped-theme, overflow, and content-composition
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
