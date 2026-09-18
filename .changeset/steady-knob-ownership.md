---
"@flux-ui/react": minor
---

Tighten Knob's pre-1.0 state ownership contract. Controlled knobs now require onValueChange and reject defaultValue, while uncontrolled knobs continue to support optional defaultValue and change notifications. Revision the Knob performance workload after its controlled fixture adopts the explicit owner callback.
