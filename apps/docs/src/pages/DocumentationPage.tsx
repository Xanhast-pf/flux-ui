import { Accordion, Stack } from "@flux-ui/react";
import { REPOSITORY_URL } from "../lib/format.js";
export function DocumentationPage() {
  return (
    <section className="reference-page">
      <Stack gap="md">
        <h1>Documentation</h1>
        <ul>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/workshop.md`}>
              Workshop architecture and examples
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/README.md`}>Project README</a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/development.md`}>
              Development workflow
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/architecture.md`}>
              Architecture
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/component-api.md`}>
              Component API rules
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/design-tokens.md`}>
              Design tokens
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/performance.md`}>
              Performance philosophy
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}>
              Contributing
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/AGENTS.md`}>
              Engineering contract
            </a>
          </li>
        </ul>
        <h2>Good questions, small answers.</h2>
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Trigger>
              How do I add a component without manual wiring?
            </Accordion.Trigger>
            <Accordion.Content>
              Run <code>pnpm component:new Name Category</code>, implement its
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
              <code>pnpm size:update</code> and review the result; budgets do
              not increase automatically.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Stack>
    </section>
  );
}
