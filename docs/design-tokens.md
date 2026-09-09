# Design tokens

Flux tokens define the visual rules shared by every component. Component code should consume semantic tokens instead of inventing local values for repeated design decisions.

## Spatial rhythm

Flux uses an explicit **0.25rem spatial grid**.

Reusable spacing, radius, control-size, and breakpoint tokens must:

- use `rem`;
- be exact multiples of `0.25rem`;
- be stored as explicit values;
- never use `calc()`, `clamp()`, `min()`, or `max()` to manufacture token values.

The standard spacing is `1rem` (`space.4`). The standard control radius is `0.25rem`.

```text
space.1   0.25rem
space.2   0.5rem
space.3   0.75rem
space.4   1rem      ← standard
space.5   1.25rem
space.6   1.5rem
space.8   2rem
space.10  2.5rem
space.12  3rem
space.16  4rem

radius.sm 0.25rem
radius.md 0.25rem   ← standard
radius.lg 0.5rem
```

Layout gap aliases intentionally make the normal choice obvious:

```text
none  0rem
xs    0.25rem
sm    0.5rem
md    1rem
lg    1.5rem
xl    2rem
```

Optical values are not spatial rhythm. Hairline borders, focus-ring strokes, percentages, transforms, and animation timing may use the unit that best preserves the intended rendering.

## Color system

Components consume semantic roles, not numbered palette positions.

### Neutral roles

- `canvas` — application background
- `surface` — normal component surface
- `surfaceSubtle` — quiet hover/secondary surface
- `surfaceElevated` — overlays/elevated regions
- `text` — primary content
- `textMuted` — secondary content
- `textSubtle` — tertiary metadata
- `border` — ordinary separators
- `borderStrong` — interactive/emphasized boundaries

### Product and semantic roles

Each semantic tone has a solid color, hover color, soft surface, and foreground:

- `accent`
- `success`
- `warning`
- `danger`
- `info`

`focus` is a dedicated interaction token rather than an alias to a component color.

The palette is intentionally asymmetric between light and dark themes. Dark mode is not created by mathematically inverting light colors; each theme uses colors chosen for its own surface hierarchy and contrast.

## Contrast contract

The token tests enforce WCAG-style contrast requirements for:

- primary/muted/subtle text;
- solid semantic colors and their foregrounds;
- semantic colors on their soft surfaces;
- focus indicators against canvas and surface.

Do not update colors merely because they look good in one screenshot. A palette change must keep the token tests green and should be reviewed in both themes across dense and sparse UI.

## Theme switching

Default values live in `packages/tokens/src/theme.css`.

```html
<html data-flux-theme="light"></html>
```

```html
<html data-flux-theme="dark"></html>
```

Theme changes remap semantic CSS custom properties and do not require React rerenders.
