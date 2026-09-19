---
"@flux-ui/react": minor
---

Harden the final Core catalog APIs before beta. Controlled Sidebar and SplitPane state now require owner callbacks, Sidebar toggle wiring and decorative Avatar/ColorSwatch semantics are runtime-owned, composed catalog primitives reject incompatible innerHTML injection, ScrollArea rejects hidden-but-focusable regions, and the Sidebar/SplitPane performance fixtures are revisioned after adopting explicit controlled owners.
