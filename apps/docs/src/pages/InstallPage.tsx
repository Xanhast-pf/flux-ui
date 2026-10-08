import { Callout, Heading, PageHeader, Stack, Text } from "@flux-ui/react";
import { CodeBlock } from "../ui/CodeBlock.js";
export function InstallPage() {
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <PageHeader title="Installation">
        <Text as="p">Set up Flux for your app or this repository.</Text>
      </PageHeader>
      <Callout tone="warning">
        Flux UI is pre-stable. Check component status before use. Install only
        an approved release or candidate archive; npm versions may be
        unavailable.
      </Callout>
      <Stack gap="md">
        <Heading level={2} size="lg">
          Use Flux in your app
        </Heading>
        <Text as="p">
          Use React 19.2 and Node 24+ for builds. Copy the three approved
          candidate archives into your app.
        </Text>
        <CodeBlock
          language="bash"
          label="Consumer candidate setup"
          code={`# Use the same immutable candidate for components, tokens and icons.
# Rename the approved archives to these local filenames without altering their bytes.
pnpm add ./vendor/flux-ui-react.tgz ./vendor/flux-ui-tokens.tgz ./vendor/flux-ui-icons.tgz

# Also use package.json pnpm.overrides for transitive Flux dependencies.
# The complete recipe downloads already include this configuration.`}
        />
        <CodeBlock
          language="json"
          label="Candidate package resolution"
          code={`{
  "pnpm": {
    "overrides": {
      "@flux-ui/react": "file:./vendor/flux-ui-react.tgz",
      "@flux-ui/tokens": "file:./vendor/flux-ui-tokens.tgz",
      "@flux-ui/icons": "file:./vendor/flux-ui-icons.tgz"
    }
  }
}`}
        />
        <Text as="p">
          Use these overrides for unpublished candidates. Switch to matching
          approved versions when published.
        </Text>
        <CodeBlock
          language="tsx"
          label="First public Flux interface"
          code={`import "@flux-ui/tokens/theme.css";
import "@flux-ui/tokens/reset.css";
import "@flux-ui/tokens/presets.css"; // Optional color palette presets.
import { Button, Container, Field, Input, Stack } from "@flux-ui/react";

export function App() {
  return (
    <Container
      as="main"
      size="sm"
      data-flux-theme="light"
      data-flux-palette="indigo"
    >
      <Stack gap="lg" padding="lg">
        <Field.Root description="Your work address is used for this local example.">
          <Field.Label>Work email</Field.Label>
          <Field.Control><Input type="email" /></Field.Control>
        </Field.Root>
        <Button>Continue</Button>
      </Stack>
    </Container>
  );
}`}
        />
        <Text as="p">
          Import tokens once. Component styles are included; icons stay
          separate.
        </Text>
      </Stack>
      <Stack gap="md">
        <Heading level={2} size="lg">
          Use a dashboard recipe
        </Heading>
        <Text as="p">
          In Playground, select a dashboard and download its recipe. The ZIP
          includes source, artwork, license, and Vite setup. Add the approved
          package archives before installing.
        </Text>
        <Callout>
          Dashboard actions are local demos. Recipes have no backend,
          persistence, or release attestation.
        </Callout>
      </Stack>
      <Stack gap="md">
        <Heading level={2} size="lg">
          Server rendering
        </Heading>
        <Text as="p">
          Use Field root slots when server markup needs description or error
          relationships.
        </Text>
        <Text as="p">
          Hydration is tested, but Next.js and React Server Components remain
          unverified for this candidate. Test your framework and client
          boundary.
        </Text>
      </Stack>
      <Stack gap="md">
        <Heading level={2} size="lg">
          Contribute
        </Heading>
        <Text as="p">
          Contributors need Node 24+ and pnpm 10.34.5. Run pnpm flux for
          commands.
        </Text>
        <CodeBlock
          language="bash"
          label="Repository contributor setup"
          code={`git clone https://github.com/Xanhast-pf/flux-ui.git
cd flux-ui
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm flux doctor
pnpm flux dev
# Optional isolated workbench:
pnpm flux dev storybook

# Start with focused tests for the affected behavior.
pnpm flux check
# Broader checks include a performance smoke test, not the full benchmark.
pnpm flux check full
# Full runtime regression measurement, when required:
pnpm flux perf`}
        />
        <CodeBlock
          language="bash"
          label="Component scaffolding and generation"
          code={`pnpm flux component new SegmentedControl Inputs interactive
pnpm flux component doctor SegmentedControl
pnpm flux maintain generate

# After approved versions have been prepared and built:
pnpm flux release pack
pnpm flux release consumer`}
        />
        <Text as="p">
          Packed-consumer checks test exact archives in Chromium, Firefox, and
          WebKit and build the exported recipes. These checks do not publish.
        </Text>
      </Stack>
    </Stack>
  );
}
