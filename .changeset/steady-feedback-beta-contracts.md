---
"@flux-ui/react": minor
---

Harden feedback and status APIs before beta. Exposed Meter and Progress instances now require a programmatic name while decorative duplicates can be explicitly hidden, Progress rejects non-finite values and invalid maxima before native rendering, composed feedback components reserve dangerouslySetInnerHTML, and Toast/EmptyState optional values are friendlier under exactOptionalPropertyTypes.
