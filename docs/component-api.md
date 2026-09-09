# Component API design

Flux follows a layered API model:

1. excellent defaults;
2. a small set of common semantic props;
3. native element props;
4. composition/slots for structural customization;
5. CSS and state-attribute escape hatches;
6. low-level hooks/primitives only for behavior-heavy components.

A permanent public prop is more expensive than an internal implementation detail. Add public API only when repeated real-world usage proves it belongs there.
