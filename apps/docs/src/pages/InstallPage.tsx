import { Stack } from "@flux-ui/react";
import { CodeBlock } from "../ui/CodeBlock.js";
export function InstallPage() {
  return (
    <section className="reference-page">
      <Stack gap="md">
        <div>
          <h1>Install & onboarding</h1>
          <p>
            Flux UI is still alpha and not yet presented as a stable public
            package. To work on the repository:
          </p>
        </div>

        <CodeBlock
          code={`git clone https://github.com/Xanhast-pf/flux-ui.git
cd flux-ui
nvm use
corepack enable
pnpm install
pnpm check`}
          label="Repository setup commands"
        />

        <div>
          <h2>Package shape</h2>
          <p>
            Components and icons remain separate packages so icon-only usage
            does not pull in the component runtime.
          </p>
          <CodeBlock
            code={`pnpm add @flux-ui/react @flux-ui/icons

import { SearchIcon } from "@flux-ui/icons";`}
            label="Package install shape"
          />
        </div>

        <div>
          <h2>Daily development</h2>
          <CodeBlock
            code={`pnpm dev
pnpm storybook

# Before pushing
pnpm check

# Browser, a11y, Storybook and perf
pnpm check:full`}
            label="Daily development commands"
          />
        </div>

        <div>
          <h2>Add a component</h2>
          <CodeBlock
            code={`pnpm component:new SegmentedControl Inputs interactive
pnpm component:doctor SegmentedControl
pnpm size:update`}
            label="Component scaffolding commands"
          />
        </div>
      </Stack>
    </section>
  );
}
