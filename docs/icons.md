# Flux Icons

`@varua/icons` contains the original Flux icon set. The generated catalog covers actions, navigation, status, theme, layout, content, communication, developer tooling, and brand.

```tsx
import { SearchIcon, SlidersIcon } from "@varua/icons";

<SearchIcon aria-hidden="true" />
<SlidersIcon aria-label="Settings" size={24} />
```

## Search and naming

`packages/icons/icons.json` is canonical. Each entry has one unique geometry and a set of lowercase intent keywords. Prefer adding a keyword such as `settings`, `external`, or `team` over creating a second icon with identical SVG geometry under another name.

The live `#icons` documentation page searches the icon name, category, and keywords. `/` focuses the icon search when focus is not already inside an editable control.

The latest catalog growth came from actual Flux example gaps rather than parity targets: Save, Undo, Play, Pause, Volume, VolumeOff, Share, UserPlus, ArrowUpDown, Heart, and ShoppingBag. Sort-direction aliases are keywords on the existing ArrowUp/ArrowDown geometry rather than duplicate icons.

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

After adding icons, inspect `pnpm flux size icons`. Only after explicit review may maintainers run `pnpm flux size icons accept` to accept the separate per-icon baseline from the production build. Do not raise the ceilings to accommodate a new drawing.
