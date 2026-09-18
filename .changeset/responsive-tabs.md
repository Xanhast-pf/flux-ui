---
"@flux-ui/react": minor
---

Remove the experimental public Overflow component before 1.0. Tabs now automatically keeps the selected tab visible and presents hidden tabs in a Flux DropdownMenu. Remove `<Overflow>` and render ordinary Tabs; no migration wrapper or new overflow props are needed.

Add reduced-motion-aware panel entrance transitions and discreet, themed native scrollbars to Flux scrolling surfaces. Wrapping and vertical Tabs retain their explicit layouts; native horizontal scrolling remains the progressive fallback.
