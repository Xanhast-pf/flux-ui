import { Box, Heading, PageHeader, Stack, Text } from "@flux-ui/react";
import { CodeBlock } from "../ui/CodeBlock.js";
export function InstallPage() {
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="md">
        <PageHeader title={<>Install & onboarding</>}>
          <Text as="p" variant="body">
            Flux UI is still alpha and not yet presented as a stable public
            package. To work on the repository:
          </Text>
        </PageHeader>

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
            code={`pnpm add @flux-ui/react @flux-ui/icons

import { SearchIcon } from "@flux-ui/icons";`}
            label="Package install shape"
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
pnpm size:update`}
            label="Component scaffolding commands"
          />
        </Box>
      </Stack>
    </Stack>
  );
}
