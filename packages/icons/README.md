# @flux-ui/icons

Original Flux UI iconography built on a 20 × 20 grid. The current set contains 64 icons across navigation, actions, status, theme, layout, content, communication, developer tooling, and brand.

```tsx
import { SearchIcon, SparkIcon } from "@flux-ui/icons";

<SearchIcon aria-label="Search" />
<SparkIcon aria-hidden="true" size={24} />
```

## Contract

- 20 × 20 source grid
- 1.5 px default stroke
- `currentColor`
- rounded joins and caps
- decorative by default
- normal SVG props and React 19 refs
- no styling runtime
- generated from `icons.json`
- searchable intent keywords on every manifest entry
- no duplicate geometry aliases; use keywords instead

Run `pnpm generate` after editing the manifest.

`FluxMarkIcon` uses the approved filled ribbon silhouette instead of a stroke.
It still inherits `currentColor`; the color-gradient branding asset is an SVG
in `@flux-ui/identity/brand/flux-mark.svg`, not extra runtime in the icon package.
