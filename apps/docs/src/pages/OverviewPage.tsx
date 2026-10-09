import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeIcon,
  GaugeIcon,
  ShieldCheckIcon,
} from "@varua/icons";
import {
  Card,
  Collapsible,
  Grid,
  Heading,
  Inline,
  Link,
  PageHeader,
  Separator,
  Stack,
  Text,
} from "@varua/flux-ui";
import { components } from "../generated/components.js";
import { health } from "../generated/health.js";
import { formatBytes } from "../lib/format.js";
import { OverviewShowcaseGrid } from "../showcase/OverviewShowcaseGrid.js";

export function OverviewPage() {
  const button = health.size.components.find(
    (entry) => entry.slug === "button",
  );
  const principles = [
    {
      id: "tokens",
      label: "01 / Themes",
      title: "Choose your colors.",
      description: "Mix palettes with semantic tokens.",
      action: "Explore tokens",
    },
    {
      id: "components",
      label: "02 / Components",
      title: "Build with components.",
      description: `${components.length} component families with native props and flexible composition.`,
      action: "Browse components",
    },
    {
      id: "engineering",
      label: "03 / Engineering",
      title: "Built to adapt.",
      description: "Simple APIs, static CSS, and public components.",
      action: "Engineering details",
    },
  ];
  const evidence = [
    {
      id: "lab",
      Icon: GaugeIcon,
      title: "Stress test",
      description: "Compare workloads locally.",
    },
    {
      id: "size",
      Icon: CodeIcon,
      title: `${formatBytes(button?.brotli ?? null)} · Button runtime graph`,
      description: "Committed Brotli baseline. Not an app-bundle claim.",
    },
    {
      id: "trust",
      Icon: ShieldCheckIcon,
      title: "Verification",
      description: "Build and security checks.",
    },
    {
      id: "accessibility",
      Icon: ShieldCheckIcon,
      title: "Accessibility",
      description: "Run an axe scan on a live example.",
    },
  ];
  return (
    <Stack gap={16}>
      <Grid
        as="section"
        templateColumns={{
          base: "minmax(0, 1fr)",
          lg: "minmax(0, 1.4fr) minmax(0, 1fr)",
        }}
        gap={{ base: 6, lg: 16 }}
        align="center"
        paddingBlock={8}
      >
        <PageHeader
          title={
            <>
              One system.
              <br />
              <Text tone="muted">Different worlds.</Text>
            </>
          }
          eyebrow="Flux UI / a React design system"
        />
        <Stack gap="md">
          <Text as="p" variant="lead">
            Build with Flux.
          </Text>
          <Text as="p" tone="muted">
            Accessible React components with flexible themes.
          </Text>
          <Inline wrap gap="md">
            <Link href="#install" variant="solid">
              Start building <ArrowUpRightIcon size={16} />
            </Link>
            <Link href="#components" variant="ghost">
              Browse components <ArrowRightIcon size={16} />
            </Link>
          </Inline>
          <Text variant="caption" tone="muted">
            Open source · React 19 · Static CSS · Pre-stable
          </Text>
        </Stack>
      </Grid>
      <OverviewShowcaseGrid />
      <Stack aria-labelledby="system-story-title" as="section" gap="xl">
        <Stack gap="md">
          <Text as="p" variant="eyebrow" tone="muted">
            Flexible by design
          </Text>
          <Heading id="system-story-title" level={2} size="lg">
            One foundation. Many uses.
          </Heading>
          <Text as="p" tone="muted">
            Use the same components across different apps.
          </Text>
        </Stack>
        <Grid columns={{ base: 1, lg: 3 }} gap="lg">
          {principles.map((item) => (
            <Card key={item.id}>
              <Stack gap="md">
                <Text variant="caption" tone="muted">
                  {item.label}
                </Text>
                <Heading level={3} size="md">
                  {item.title}
                </Heading>
                <Text as="p" tone="muted">
                  {item.description}
                </Text>
                <Link href={`#${item.id}`}>
                  {item.action} <ArrowUpRightIcon size={16} />
                </Link>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
      <Card
        as="section"
        aria-label="Inspect the evidence"
        surface="subtle"
        padding="lg"
      >
        <Grid
          templateColumns={{
            base: "minmax(0, 1fr)",
            lg: "minmax(0, 1fr) minmax(0, 1.2fr)",
          }}
          gap="xl"
        >
          <Stack gap="md">
            <Text as="p" variant="eyebrow" tone="muted">
              Open by design
            </Text>
            <Heading level={2} size="lg">
              See the evidence.
            </Heading>
            <Text as="p" tone="muted">
              Explore tests, measurements, and limits.
            </Text>
          </Stack>
          <Stack gap="lg">
            {evidence.map((item) => (
              <Stack gap="xs" key={item.id}>
                <Link href={`#${item.id}`}>
                  <item.Icon size={20} />
                  {item.title}
                  <ArrowUpRightIcon size={16} />
                </Link>
                <Text as="p" variant="caption" tone="muted">
                  {item.description}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Card>
      <Grid
        aria-label="A few honest answers"
        as="section"
        columns={{ base: 1, lg: 2 }}
        gap="xl"
      >
        <Stack gap="md">
          <Text as="p" variant="eyebrow" tone="muted">
            FAQs
          </Text>
          <Heading level={2} size="lg">
            Common questions
          </Heading>
          <Text as="p" tone="muted">
            Short answers about Flux.
          </Text>
        </Stack>
        <Stack gap="sm">
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is everything in the showcase a Flux component?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text as="p">
                Yes. The UI uses public Flux components. Scene artwork and data
                are custom.
              </Text>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux ready for production?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Stack gap="md">
                <Text as="p">
                  Flux is pre-stable. Check each component’s lifecycle and test
                  it in your app.
                </Text>
                <Link href="#trust">View trust evidence →</Link>
              </Stack>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Are the demos connected to real services?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text as="p">
                No. The data is fictional and actions run locally. Reloading
                resets the demos.
              </Text>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux the fastest or smallest design system?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text as="p">
                No universal ranking. Review the size checks and performance
                tests.
              </Text>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </Grid>
      <Separator />
      <Stack align="center" gap="md" paddingBlock="xl">
        <Text variant="eyebrow" tone="muted">
          Get started
        </Text>
        <Heading level={2} size="lg">
          Build something.
        </Heading>
        <Link href="#install" variant="solid">
          Start building <ArrowUpRightIcon size={16} />
        </Link>
      </Stack>
    </Stack>
  );
}
