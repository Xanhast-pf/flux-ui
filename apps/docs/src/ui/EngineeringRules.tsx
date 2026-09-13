import { Heading, List, Stack, Text } from "@flux-ui/react";
export function EngineeringRules() {
  return (
    <Stack as="section" aria-label="Engineering rules" gap="lg">
      <Stack gap="md">
        <Heading level={2} size="lg">
          Contributor rules
        </Heading>
        <List as="ol" variant="marker">
          <List.Item>
            <Text as="strong" weight="bold">
              Easy to use first.
            </Text>{" "}
            Public APIs absorb complexity instead of forcing casts, workarounds,
            or framework trivia on consumers.
          </List.Item>
          <List.Item>
            <Text as="strong" weight="bold">
              Native semantics first.
            </Text>{" "}
            Extend the platform instead of replacing it.
          </List.Item>
          <List.Item>
            <Text as="strong" weight="bold">
              Static styling.
            </Text>{" "}
            No runtime CSS-in-JS styling engine.
          </List.Item>
          <List.Item>
            <Text as="strong" weight="bold">
              Quarter-rem spatial rhythm.
            </Text>{" "}
            Reusable spacing, radii, controls, and breakpoints use explicit rem
            values on a 0.25rem grid.
          </List.Item>
          <List.Item>
            <Text as="strong" weight="bold">
              Standard spacing is 1rem.
            </Text>{" "}
            Default radius is 0.25rem.
          </List.Item>
          <List.Item>
            <Text as="strong" weight="bold">
              Performance is a contract.
            </Text>{" "}
            Size and runtime regressions fail CI.
          </List.Item>
          <List.Item>
            <Text as="strong" weight="bold">
              Accessibility is not optional.
            </Text>{" "}
            Components and the docs app are tested with semantic, keyboard, and
            automated accessibility checks.
          </List.Item>
          <List.Item>
            <Text as="strong" weight="bold">
              Generated infrastructure stays deterministic.
            </Text>{" "}
            New components are scaffolded and registered by convention.
          </List.Item>
        </List>
      </Stack>
    </Stack>
  );
}
