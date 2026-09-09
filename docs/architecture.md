# Architecture

Flux starts intentionally small: one public React package, one token package, and one docs/playground application.

## Layers

```text
semantic tokens + theme CSS
          ↓
component-local static CSS
          ↓
React components
          ↓
docs / consumers
```

Component behavior and presentation are separate concerns, but separation is earned. Simple primitives stay simple; behavior-heavy widgets may build on Base UI or expose a headless hook when that produces a meaningful reusable contract.

## Why Vanilla Extract

Flux needs CSS that is generated at build time, locally scoped, typed where useful, and compatible with CSS variables. No style engine should execute during normal component rendering.

## Why Vite library mode

Vite/Rolldown gives the package a fast ESM build and code splitting. `vite-plugin-lib-inject-css` keeps component CSS associated with emitted library chunks using static CSS imports rather than DOM style injection.
