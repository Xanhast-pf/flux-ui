import { Stack } from "@flux-ui/react";
export function RulesPage() {
  return (
    <section className="reference-page">
      <Stack gap="md">
        <h1>Main engineering rules</h1>
        <ol>
          <li>
            <strong>Easy to use first.</strong> Public APIs absorb complexity
            instead of forcing casts, workarounds, or framework trivia on
            consumers.
          </li>
          <li>
            <strong>Native semantics first.</strong> Extend the platform instead
            of replacing it.
          </li>
          <li>
            <strong>Static styling.</strong> No runtime CSS-in-JS styling
            engine.
          </li>
          <li>
            <strong>Quarter-rem spatial rhythm.</strong> Reusable spacing,
            radii, controls, and breakpoints use explicit rem values on a
            0.25rem grid.
          </li>
          <li>
            <strong>Standard spacing is 1rem.</strong> Default radius is
            0.25rem.
          </li>
          <li>
            <strong>Performance is a contract.</strong> Size and runtime
            regressions fail CI.
          </li>
          <li>
            <strong>Accessibility is not optional.</strong> Components and the
            docs app are tested with semantic, keyboard, and automated
            accessibility checks.
          </li>
          <li>
            <strong>Generated infrastructure stays deterministic.</strong> New
            components are scaffolded and registered by convention.
          </li>
        </ol>
      </Stack>
    </section>
  );
}
