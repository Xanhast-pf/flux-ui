---
"@varua/flux-ui": patch
---

Harden controlled interaction commits and embedded-document focus restoration: Knob and SplitPane now commit the value proposed by keyboard interaction even before a controlled owner rerenders, and Sidebar restores focus through its panel's owner document.
