import { Callout, Heading, PageHeader, Stack, Text } from "@flux-ui/react";
import { CodeBlock } from "../ui/CodeBlock.js";
export function InstallPage() {
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <PageHeader title="Install & onboarding">
        <Text as="p">
          Build a consumer app, reuse a complete recipe, or contribute to Flux.
        </Text>
      </PageHeader>
      <Callout tone="warning">
        Flux UI is alpha and the public package versions in this source may
        still be unreleased. Use an explicitly approved release or candidate
        archive; do not assume a stable npm package exists.
      </Callout>
      <Stack gap="md">
        <Heading level={2} size="lg">
          Use Flux in an application
        </Heading>
        <Text as="p">
          The current source targets React 19.2 and Node 24 or newer for its
          build toolchain. The example below uses exact candidate archives, not
          workspace aliases. Copy all three approved archives into your
          application first.
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
          Add the override configuration before installing when the candidate
          versions are not on the registry. Once packages are published, replace
          local paths with the explicitly approved matching versions.
        </Text>
        <CodeBlock
          language="tsx"
          label="First public Flux interface"
          code={`import "@flux-ui/tokens/theme.css";
import "@flux-ui/tokens/reset.css";
import "@flux-ui/tokens/presets.css"; // Optional product moods.
import { Button, Container, Field, Input, Stack, ThemeScope } from "@flux-ui/react";

export function App() {
  return (
    <ThemeScope theme="paper" query>
      <Container as="main" size="sm">
        <Stack gap="lg" padding="lg">
          <Field.Root description="Your work address is used for this local example.">
            <Field.Label>Work email</Field.Label>
            <Field.Control><Input type="email" /></Field.Control>
          </Field.Root>
          <Button>Continue</Button>
        </Stack>
      </Container>
    </ThemeScope>
  );
}`}
        />
        <Text as="p">
          Import foundations once at your application entry. Built public
          components include their component CSS. Icons remain separate, and
          scoped moods use public tokens rather than private CSS skins.
        </Text>
      </Stack>
      <Stack gap="md">
        <Heading level={2} size="lg">
          Start from a complete application recipe
        </Heading>
        <Text as="p">
          Open a product scene in the Playground, expand its composition
          inspector, and choose Download complete recipe. The ZIP includes its
          source dependencies, artwork, license, entrypoint, package manifest
          and TypeScript/Vite setup. Supply the candidate packages, then run the
          included install and build commands.
        </Text>
        <Callout>
          Finance transactions, invitations and studio checkpoints are local
          simulations. Recipes do not include a backend, audio processing,
          persistence after reload, or a release attestation.
        </Callout>
      </Stack>
      <Stack gap="md">
        <Heading level={2} size="lg">
          Server rendering and framework boundaries
        </Heading>
        <Text as="p">
          Field Root description/error slots provide deterministic initial
          server relationships. Opaque helper components register their compound
          parts after rendering; use root-owned slots when the initial server
          markup must include that relationship.
        </Text>
        <Text as="p">
          The repository has hydration coverage, but that is not a general
          framework certification. Next.js and React Server Components consumer
          support remains unverified for this candidate. Validate the intended
          client boundary and packed package before promising framework
          compatibility.
        </Text>
      </Stack>
      <Stack gap="md">
        <Heading level={2} size="lg">
          Contribute to the source
        </Heading>
        <CodeBlock
          language="bash"
          label="Repository contributor setup"
          code={`git clone https://github.com/Xanhast-pf/flux-ui.git
cd flux-ui
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
pnpm storybook

# Start with focused tests for the affected behavior.
pnpm check
# Broader checks include a performance smoke test, not the full benchmark.
pnpm check:full
# Full runtime regression measurement, when required:
pnpm perf`}
        />
        <CodeBlock
          language="bash"
          label="Component scaffolding and generation"
          code={`pnpm component:new SegmentedControl Inputs interactive
pnpm component:doctor SegmentedControl
pnpm generate

# After approved versions have been prepared and built:
pnpm release:pack
pnpm consumer:packed`}
        />
        <Text as="p">
          Packed-consumer validation does not publish. It checks the exact
          archives in an isolated application across Chromium, Firefox and
          WebKit, then builds all six exported recipes. Browser binaries and the
          pinned toolchain must be installed. A source-only check does not
          replace that result.
        </Text>
      </Stack>
    </Stack>
  );
}
