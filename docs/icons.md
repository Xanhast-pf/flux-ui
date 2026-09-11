# Flux Icons

`@flux-ui/icons` contains the original Flux icon set. The current catalog has 64 glyphs across actions, navigation, status, theme, layout, content, communication, developer tooling, and brand.

```tsx
import { SearchIcon, SlidersIcon } from "@flux-ui/icons";

<SearchIcon aria-hidden="true" />
<SlidersIcon aria-label="Settings" size={24} />
```

## Search and naming

`packages/icons/icons.json` is canonical. Each entry has one unique geometry and a set of lowercase intent keywords. Prefer adding a keyword such as `settings`, `external`, or `team` over creating a second icon with identical SVG geometry under another name.

The live `#icons` documentation page searches the icon name, category, and keywords. `/` focuses the icon search when focus is not already inside an editable control.

## Accessibility

Icons are decorative by default. If adjacent text or the containing control already communicates the meaning, leave the SVG decorative.

```tsx
<IconButton aria-label="Search">
  <SearchIcon aria-hidden="true" />
</IconButton>
```

If the icon itself carries meaning, give it an accessible name:

```tsx
<ShieldCheckIcon aria-label="Verified" />
```

`aria-hidden="false"` alone does not synthesize `role="img"`; an icon only gets the image role automatically when it has a non-empty title, `aria-label`, or `aria-labelledby` reference.

## Size contract

Every individual icon is measured together with the shared `IconBase` runtime. The absolute ceilings remain:

- raw: 3 KiB
- gzip: 1.25 KiB
- Brotli: 1 KiB

Run `pnpm size:update` after adding icons so new per-icon baselines are measured from the production build. Do not raise the ceilings to accommodate a new drawing.
