import { EngineeringRules } from "../ui/EngineeringRules.js";
import {
  Callout,
  Collapsible,
  Card,
  Grid,
  Heading,
  Link,
  PageHeader,
  Stack,
  Text,
} from "@flux-ui/react";
import { REPOSITORY_URL } from "../lib/format.js";
import { CodeBlock } from "../ui/CodeBlock.js";
const contracts = [
  {
    title: "Native first",
    body: "Native semantics and accessible controls.",
  },
  {
    title: "Static by design",
    body: "Static CSS with semantic tokens.",
  },
  {
    title: "Convention over registration",
    body: "Local files. Automatic discovery.",
  },
  {
    title: "Small API, real escape hatches",
    body: "Small APIs with native props and composition.",
  },
];
export function EngineeringPage() {
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="lg">
        <PageHeader title={<>Engineering</>} eyebrow={<>How Flux works</>}>
          <Text as="p" variant="lead" tone="muted">
            Accessibility and performance are built in.
          </Text>
        </PageHeader>
        <Grid
          role="group"
          aria-label="Architecture: tokens feed React components, which feed documentation"
          columns={{ base: 1, md: 3 }}
          gap="md"
        >
          {[
            [
              "01",
              "Tokens",
              "Semantic variables",
              "Light, dark and reduced motion",
            ],
            [
              "02",
              "Components",
              "Native React composition",
              "Static component CSS",
            ],
            [
              "03",
              "Real interfaces",
              "Docs consume Flux",
              "Public components in every example",
            ],
          ].map(([step, title, description, detail]) => (
            <Card key={step}>
              <Stack gap="md">
                <Text variant="eyebrow" tone="accent">
                  {step}
                </Text>
                <Heading level={2} size="md">
                  {title}
                </Heading>
                <Text as="p" tone="muted">
                  {description}
                  <br />
                  {detail}
                </Text>
              </Stack>
            </Card>
          ))}
        </Grid>
        <Grid minColumnWidth="17rem" gap="md">
          {contracts.map((entry) => (
            <Card key={entry.title}>
              <Stack gap="sm">
                <Heading level={2} size="lg">
                  {entry.title}
                </Heading>
                <Text as="p" variant="body">
                  {entry.body}
                </Text>
              </Stack>
            </Card>
          ))}
        </Grid>
        <Stack as="section" gap="lg">
          <Heading level={2} size="lg">
            API compatibility boundary
          </Heading>
          <Text as="p" variant="body">
            Component pages list public APIs and styling hooks. Beta APIs may
            change; stable APIs are supported contracts.
          </Text>
          <Text as="p" variant="body">
            Internal DOM, classes, and helpers are not public APIs.
          </Text>
        </Stack>
        <Stack as="section" gap="lg">
          <Heading level={2} size="lg">
            The measurement contract
          </Heading>
          <Text as="p" variant="body">
            Size budgets and benchmarks catch regressions, not predict app
            speed.
          </Text>
          <Collapsible.Root variant="plain">
            <Collapsible.Trigger>
              Measurement scope and limitations
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Stack gap="md">
                <Text as="p" variant="body">
                  Component graphs have raw, gzip, and Brotli budgets. Shared
                  code overlaps; totals exclude React and other packages.
                </Text>
                <Text as="p" variant="body">
                  Runtime checks compare synchronous React work. Frame timings
                  are diagnostics, not paint or input latency.
                </Text>
              </Stack>
            </Collapsible.Content>
          </Collapsible.Root>
          <Text as="p" variant="body">
            <Link href="#size">Explore bundle budgets</Link> ·{" "}
            <Link href="#lab">Run the lab</Link>
          </Text>
        </Stack>
        <Heading level={2} size="lg">
          Contributor workflow
        </Heading>
        <Text as="p">Contributors need Node 24+ and pnpm 10.34.5.</Text>
        <CodeBlock
          label="Contributor workflow"
          code={
            "pnpm install --frozen-lockfile\npnpm flux doctor\npnpm flux dev\n\npnpm flux component new MyComponent Utilities primitive\npnpm flux component doctor MyComponent\n\npnpm flux check"
          }
        />
        <Text as="p">
          Use pnpm flux for commands. Run pnpm flux check full for browser
          changes.
          <Link href={`${REPOSITORY_URL}/blob/main/docs/development.md`}>
            Contributor setup and command reference
          </Link>
        </Text>
        <Stack as="section" gap="lg">
          <Heading level={2} size="lg">
            Release checks
          </Heading>
          <Text as="p" variant="body">
            Branches verify local full-check attestations. Main requires Quality
            and Browser checks. These cover code, docs, accessibility, size, and
            compatibility. Branch protection must require the Required job.
          </Text>
          <Text as="p" variant="body">
            <Link href={`${REPOSITORY_URL}/blob/main/AGENTS.md`}>
              Read the full engineering contract →
            </Link>
          </Text>
        </Stack>
        <EngineeringRules />
        <Callout>
          Flux is pre-stable. Full docs tests run mainly in Chromium;
          compatibility checks cover three engines. Manual accessibility testing
          is still needed for production use.
        </Callout>
        <Link href="#trust" variant="solid">
          Open the Trust Center →
        </Link>
      </Stack>
    </Stack>
  );
}
