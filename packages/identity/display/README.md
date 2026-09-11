# Flux Display — vector design source

Flux Display is an uppercase display-lettering prototype, not a compiled font yet.

The source alphabet lives in `src/flux-display.ts` as SVG-path geometry on a compact 5 × 7 design grid. The docs render these paths directly so the shapes can be evaluated in the real Flux interface before font engineering begins.

Initial scope:

- A–Z
- 0–9
- space
- dash, slash, period, colon, plus

Design targets:

- 1000 units/em
- 700 cap height
- ~82-unit display stem
- square terminals
- open technical geometry
- economical curves and counters
- one design-grid unit of render padding around mitered outlines

Unsupported specimen characters are reported by the docs and currently render as spaces. The next type pass should add optical corrections, wider punctuation, Latin diacritics, lowercase, spacing pairs, then kerning. Only after the forms are approved should the source be compiled into font binaries.
