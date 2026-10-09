# @varua/tokens

Public design tokens and CSS foundations for Flux UI. The package provides
semantic CSS variables, light/dark theme values, optional palette presets, the
public reset, and JavaScript constants for the exported variable names.

## Install

```bash
pnpm add @varua/tokens
```

Import the foundations your application needs:

```ts
import "@varua/tokens/reset.css";
import "@varua/tokens/theme.css";
import "@varua/tokens/presets.css"; // Optional palette mapping.
```

Apply theme and optional palette attributes at the application or scoped theme
boundary:

```tsx
<main data-flux-theme="dark" data-flux-palette="violet">
  ...
</main>
```

The package also exports `palette.css` when raw public palette ramps are needed
and exposes `cssVars` / `paletteVars` from the JavaScript entry for typed
variable-name references.

## Contract

- semantic variables own shared UI decisions;
- light and dark values are CSS, not React runtime state;
- palette presets map public ramps onto semantic roles;
- forced-colors behavior lives in the shared token layer;
- spacing uses the Flux quarter-rem scale;
- no bundled webfont and no runtime CSS-in-JS engine;
- component-specific styling remains in `@varua/flux-ui`, not this package.

Documentation: https://flux.varua.ca/#tokens

Repository: https://github.com/Xanhast-pf/flux-ui

License: MIT
