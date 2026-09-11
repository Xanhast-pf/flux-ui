---
"@flux-ui/react": patch
---

Restore predictable surface padding and consumer CSS overrides. Serialize sparse
responsive layouts without repeating scalar values at every breakpoint, share
Stack/Inline gap styles, and unify Grid's column-mode declarations. Share modal
parts and remove the Drawer recipe runtime without changing its public API or
native focus behavior. Keep public declarations while excluding development-only
stories, examples, tests, and benchmarks from declaration output.
