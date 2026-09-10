---
"@flux-ui/react": minor
---

Add Badge, Callout, Card, Collapsible, Progress, Select, Separator, Slider, Switch, and Table.

The new primitives preserve native DOM semantics, native form attributes and React refs, use static token-based styling, and add no runtime dependencies. Switch and Slider support optional change callbacks without owning checked/value state. Collapsible uses native details/summary; Select remains a native select; Table is semantic markup, not a data-grid engine.

All ten components are initially classified under the existing primitive size budget. Their first production baselines must be measured before release. Existing public component implementations and size/performance policy thresholds are unchanged.
