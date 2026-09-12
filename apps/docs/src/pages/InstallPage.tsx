import { Box, Callout, Heading, PageHeader, Stack, Text } from "@flux-ui/react";
import { CodeBlock } from "../ui/CodeBlock.js";
export function InstallPage() {
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="md">
        <PageHeader title={<>Install & onboarding</>}>
          <Text as="p" variant="body">
            Run the source locally, explore the examples, and contribute a
            component.
          </Text>
        </PageHeader>

        <Callout tone="warning">
          Flux UI is alpha. The source workflow below is supported; do not
          assume stable npm packages are available until a release is announced.
        </Callout>
        <CodeBlock
          code={`git clone https://github.com/Xanhast-pf/flux-ui.git
cd flux-ui
nvm use
corepack enable
pnpm install
pnpm check`}
          label="Repository setup commands"
        />

        <Box>
          <Heading level={2} size="lg">
            Package shape
          </Heading>
          <Text as="p" variant="body">
            Components and icons remain separate packages so icon-only usage
            does not pull in the component runtime.
          </Text>
          <CodeBlock
            code={`// Inside the workspace
import { Button } from "@flux-ui/react";
import { SearchIcon } from "@flux-ui/icons";`}
            label="Workspace package imports"
          />
        </Box>

        <Box>
          <Heading level={2} size="lg">
            Daily development
          </Heading>
          <CodeBlock
            code={`pnpm dev
pnpm storybook

# Before pushing
pnpm check

# Browser, a11y, Storybook and perf
pnpm check:full`}
            label="Daily development commands"
          />
        </Box>

        <Box>
          <Heading level={2} size="lg">
            Add a component
          </Heading>
          <CodeBlock
            code={`pnpm component:new SegmentedControl Inputs interactive
pnpm component:doctor SegmentedControl
pnpm generate
pnpm verify:all`}
            label="Component scaffolding commands"
          />
        </Box>
      </Stack>
    </Stack>
  );
}
