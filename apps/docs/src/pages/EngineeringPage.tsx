import {
  Box,
  Callout,
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
    body: "HTML semantics, native props and browser behavior before custom abstractions. Accessibility belongs in the structure—not in a last-minute ARIA layer.",
  },
  {
    title: "Static by design",
    body: "Component styles are emitted as CSS. Semantic custom properties carry themes and accents. No runtime CSS-in-JS engine is added to consumer components.",
  },
  {
    title: "Convention over registration",
    body: "A component owns its behavior, styles, tests, stories, benchmark and metadata. Generators discover public surfaces; catalog growth does not require project-wide wiring.",
  },
  {
    title: "Small API, real escape hatches",
    body: "Sensible defaults for ordinary work. Native props, className, style, documented variables and compound composition for the uncommon case.",
  },
];
export function EngineeringPage() {
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="lg">
        <PageHeader
          title={<>A system beneath the surface.</>}
          eyebrow={<>Built to be inspected</>}
        >
          <Text as="p" variant="lead" tone="muted">
            Performance and accessibility are engineering contracts, not the
            last line of a launch page.
          </Text>
        </PageHeader>
        <Grid
          role="group"
          aria-label="Architecture: tokens feed React components, which feed documentation"
          className="system-flow"
          columns={{ base: 1, md: 3 }}
          gap="none"
        >
          <Box>
            <Text>01</Text>
            <Heading level={2} size="lg">
              Tokens
            </Heading>
            <Text as="p" variant="body">
              Semantic variables
              <br />
              Light · dark · reduced motion
            </Text>
          </Box>
          <Box>
            <Text>02</Text>
            <Heading level={2} size="lg">
              Components
            </Heading>
            <Text as="p" variant="body">
              Native React composition
              <br />
              Static component CSS
            </Text>
          </Box>
          <Box>
            <Text>03</Text>
            <Heading level={2} size="lg">
              Real interfaces
            </Heading>
            <Text as="p" variant="body">
              Docs consume Flux
              <br />
              Same source in every demo
            </Text>
          </Box>
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
            The measurement contract
          </Heading>
          <Text as="p" variant="body">
            Per-component emitted runtime graphs have raw, gzip and Brotli
            budgets, plus historical regression checks. Shared graphs overlap:
            adding every component’s compressed size is not an application
            bundle estimate. React and external packages are outside these graph
            measurements.
          </Text>
          <Text as="p" variant="body">
            Runtime checks compare synchronous mount, update and unmount against
            equivalent native React implementations. Paired medians reduce order
            bias; absolute cost accompanies ratios. Next-frame diagnostics are
            not paint or input-latency measurements. The live lab is an
            experiment, not a claim to be the fastest library.
          </Text>
          <Text as="p" variant="body">
            <Link href="#size">Explore bundle budgets</Link> ·{" "}
            <Link href="#lab">Run the lab</Link>
          </Text>
        </Stack>
        <CodeBlock
          label="Contributor workflow"
          code={
            "pnpm component:new MyComponent Utilities\npnpm component:doctor MyComponent\npnpm generate\npnpm check:full"
          }
        />
        <Stack as="section" gap="lg">
          <Heading level={2} size="lg">
            What blocks a merge?
          </Heading>
          <Text as="p" variant="body">
            The Required CI job depends on both Quality and Browser. Quality
            checks generation drift, docs coverage, formatting, lint,
            TypeScript, unused code, tests, builds, size budgets and Coding
            Bible. Browser runs Chromium behavior, axe and native-relative
            performance checks. Pages is built only after those jobs pass.
            Repository rules must require that check; a YAML file cannot enable
            branch protection.
          </Text>
          <Text as="p" variant="body">
            <Link href={`${REPOSITORY_URL}/blob/main/AGENTS.md`}>
              Read the full engineering contract →
            </Link>
          </Text>
        </Stack>
        <Callout>
          Current limits: alpha APIs, two runtime benchmark scenarios, and
          Chromium-focused browser automation. Manual assistive-technology
          testing and broader browser coverage remain explicit review work. See
          the Trust Center before adopting Flux for a production-critical
          interface.
        </Callout>
        <Link href="#trust" variant="solid">
          Open the Trust Center →
        </Link>
      </Stack>
    </Stack>
  );
}
