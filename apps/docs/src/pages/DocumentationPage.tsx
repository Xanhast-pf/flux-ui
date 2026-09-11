import { Accordion, Code, Heading, Link, List, Stack } from "@flux-ui/react";
import { REPOSITORY_URL } from "../lib/format.js";
export function DocumentationPage() {
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="md">
        <Heading level={1} size="xl">
          Documentation
        </Heading>
        <List as="ul" variant="marker">
          <List.Item>
            <Link href={`${REPOSITORY_URL}/blob/main/docs/workshop.md`}>
              Workshop architecture and examples
            </Link>
          </List.Item>
          <List.Item>
            <Link href={`${REPOSITORY_URL}/blob/main/README.md`}>
              Project README
            </Link>
          </List.Item>
          <List.Item>
            <Link href={`${REPOSITORY_URL}/blob/main/docs/development.md`}>
              Development workflow
            </Link>
          </List.Item>
          <List.Item>
            <Link href={`${REPOSITORY_URL}/blob/main/docs/architecture.md`}>
              Architecture
            </Link>
          </List.Item>
          <List.Item>
            <Link href={`${REPOSITORY_URL}/blob/main/docs/component-api.md`}>
              Component API rules
            </Link>
          </List.Item>
          <List.Item>
            <Link href={`${REPOSITORY_URL}/blob/main/docs/design-tokens.md`}>
              Design tokens
            </Link>
          </List.Item>
          <List.Item>
            <Link href={`${REPOSITORY_URL}/blob/main/docs/identity.md`}>
              Flux identity and iconography
            </Link>
          </List.Item>
          <List.Item>
            <Link href={`${REPOSITORY_URL}/blob/main/docs/performance.md`}>
              Performance philosophy
            </Link>
          </List.Item>
          <List.Item>
            <Link href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}>
              Contributing
            </Link>
          </List.Item>
          <List.Item>
            <Link href={`${REPOSITORY_URL}/blob/main/AGENTS.md`}>
              Engineering contract
            </Link>
          </List.Item>
        </List>
        <Heading level={2} size="lg">
          Good questions, small answers.
        </Heading>
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Trigger>
              How do I add a component without manual wiring?
            </Accordion.Trigger>
            <Accordion.Content>
              Run <Code>pnpm component:new Name Category</Code>, implement its
              API and preview, then run the generator and quality checks. The
              catalog discovers examples by convention.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Trigger>
              Does a green demo mean the component is production-ready?
            </Accordion.Trigger>
            <Accordion.Content>
              No. The alpha catalog still needs the full lint, types, unit,
              browser, accessibility, build and size pipeline. A preview is one
              integration check, not certification.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Trigger>
              Why does a size entry say Pending baseline?
            </Accordion.Trigger>
            <Accordion.Content>
              New components need a real production measurement. Run{" "}
              <Code>pnpm size:update</Code> and review the result; budgets do
              not increase automatically.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Stack>
    </Stack>
  );
}
